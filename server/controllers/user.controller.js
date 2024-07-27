const {
  payloadToToken,
  tokenToPayload,
} = require("../helpers/token-generator");
const { compareThePass, hashThePassword } = require("../helpers/encryption");
const { User, Session } = require("../models");
const { sendVerificationEmail } = require("../helpers/email-verification");
const { OAuth2Client } = require("google-auth-library");
const passport = require("passport");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const jwt = require("jsonwebtoken");
const { Op, fn, col, literal } = require("sequelize");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, emails, name } = profile;
      const email = emails?.[0]?.value;

      let user = await User.findOne({ where: { facebook_sso_id: id } });

      if (!user) {
        user = await User.create({
          full_name: `${name.givenName} ${name.familyName}`,
          email,
          facebook_sso_id: id,
          password: "Bismillah",
          sso_sign_option: "FACEBOOK",
        });
      }

      // Update is_verified to true
      user.is_verified = true;
      // Update is_login to true and increment login_count
      user.is_login = true;
      user.login_count = user.login_count + 1;
      await user.save();

      const token = payloadToToken({ id: user.id });
      done(null, { user, token });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

class UserController {
  // Register new user
  static async signUp(req, res, next) {
    try {
      // Destructuring payload from client
      const { full_name, email, password, phone_number } = req.body;

      // Create and get user
      let data = (
        await User.create({
          full_name,
          email,
          password,
          phone_number,
        })
      ).get({ plain: true });

      // Generate access token
      const token = payloadToToken({ id: data.id });

      // Send verification email
      const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;
      await sendVerificationEmail(data.email, verificationLink);

      // Send response
      res.status(201).json({ message: "user created successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Function ton generate tokens
  static generateTokens = async (user) => {
    try {
      const access_token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const refresh_token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );

      await Session.create({ userId: user.id, token: refresh_token });
      return { access_token, refresh_token };
    } catch (error) {
      throw new Error("Error generating tokens");
    }
  };

  // Verification new user
  static async accountVerificarion(req, res, next) {
    try {
      // Get the token
      const { token } = req.params;
      let { id } = tokenToPayload(token);

      // Check the user
      let user = await User.findByPk(id);
      if (!user) throw { name: "token_expired" };

      // Update is_verified to true
      user.is_verified = true;
      // Update is_login to true and increment login_count
      user.is_login = true;
      user.login_count = user.login_count + 1;
      await user.save();

      // Generate access token & refresh token
      const { access_token, refresh_token } =
        await UserController.generateTokens(user);

      // Store to cookies
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      // Send response
      res.status(200).json({
        access_token,
        user: { full_name: user.full_name, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login funtion
  static async signIn(req, res, next) {
    try {
      // Destructuring payload
      const { email, password } = req.body;

      // Validate body
      if (!password || !email) throw { name: "empty" };

      const user = await User.findOne({ where: { email } });

      // Check if the user exists
      if (!user) throw { name: "Not_Valid" };

      // Compare the password
      const isValid = compareThePass(password, user.password);
      if (!isValid) throw { name: "Not_Valid" };

      // Check if user verified
      if (!user.is_verified) throw { name: "not_verified" };

      // Update is_login to true and increment login_count
      user.is_login = true;
      user.login_count = (user.login_count || 0) + 1;
      await user.save();

      // Generate access token & refresh token
      const { access_token, refresh_token } =
        await UserController.generateTokens(user);

      // Store to cookies
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      // Send response
      res.status(200).json({
        access_token,
        user: { full_name: user.full_name, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  }

  // Generate Acesstoken when it expired
  static async generateAccessToken(req, res, next) {
    try {
      const { refresh_token } = req.cookies;
      if (!refresh_token) throw { name: "empty_token" };
      const sesion = await Session.findOne({ where: { token: refresh_token } });
      if (!sesion) throw { name: "Forbidden" };
      jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) throw { name: "Forbidden" };
          const token = payloadToToken({ id: user.id, name: user.name });
          res.json({ access_token: token });
        }
      );
    } catch (error) {
      next(error);
    }
  }

  // Login using sso google
  static async signInWithGoogle(req, res, next) {
    try {
      // Verify Google Token
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: req.body.idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      // Get Payload From Token
      const payload = ticket.getPayload();

      // Find or Create User
      const [user] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          full_name: `${payload.given_name} ${payload.family_name}`,
          email: payload.email,
          password: "Bismillah",
          sso_sign_option: "GOOGLE",
          google_sso_id: payload.sub,
        },
      });

      // Update is_login to true and increment login_count
      user.is_login = true;
      user.login_count = (user.login_count || 0) + 1;
      await user.save();

      // Create new access_token
      const { access_token, refresh_token } =
        await UserController.generateTokens(user);

      // Store refresh token to cookies
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      // Response
      res.status(200).json({
        access_token,
        user: { full_name: user.full_name, email: user.email },
        img: payload.picture,
      });
    } catch (error) {
      next(error);
    }
  }

  // send email verification
  static async sendVerification(req, res, next) {
    try {
      const { email } = req.query;

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate token
      const token = payloadToToken({ id: user.id });

      // Send verification email
      const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;
      await sendVerificationEmail(email, verificationLink);
      // Send response
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Login using facebook
  static async signInWithFacebook(req, res, next) {
    passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
  }
  // Facebook callback
  static async facebookCallback(req, res, next) {
    passport.authenticate(
      "facebook",
      { sessions: false },
      (err, data, info) => {
        if (err) return next(err);
        if (!data) return res.redirect(`${process.env.CLIENT_URL}/login`);

        const { token, user } = data;
        res.redirect(
          `${process.env.CLIENT_URL}/auth?token=${token}&full_name=${user.full_name}&email=${user.email}`
        );
      }
    )(req, res, next);
  }

  // Forgot password
  static async forgotPassword(req, res, next) {
    try {
      // Destructuring payload
      const { email } = req.body;

      // Validate body
      if (!email) throw { name: "empty" };

      const user = await User.findOne({ where: { email } });

      // Check if the user exists
      if (!user) throw { name: "Not_Found" };

      // Generate access token
      const token = payloadToToken({ id: user.id });

      // Send verification email
      const verificationLink = `${process.env.CLIENT_URL}/change-password?token=${token}`;
      await sendVerificationEmail(
        email,
        verificationLink,
        "Please Click this link to change your password"
      );

      // Send response
      res.status(201).json({ message: "email send successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Change password
  static async changePassword(req, res, next) {
    try {
      // Destructuring payload
      const { password, token } = req.body;
      let payload = tokenToPayload(token);

      let user = await User.findByPk(payload.id);
      if (!user) throw { name: "JsonWebTokenError" };

      // Compare the password
      const isValid = compareThePass(password, user.password);
      if (isValid) throw { name: "pass-used" };

      // Update password
      user.password = hashThePassword(password);
      await user.save();

      // Send response
      res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
      next(error);
    }
  }
  // Log out function
  static async logOut(req, res, next) {
    try {
      const { id } = req.user;
      const { refresh_token } = req.cookies;

      // Find user by ID
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update is_login to false
      user.is_login = false;
      await user.save();
      await Session.destroy({ where: { token: refresh_token } });

      // clear cookies
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      // Send response
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  // Get user list
  static async getAllUsers(_, res, next) {
    try {
      // Find All User
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
        order: [["updatedAt", "DESC"]],
      });

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // Get user statistics
  static async getUsersStatistic(_, res, next) {
    try {
      // 1. Total number of users who have signed up
      const totalUsers = await User.count();

      // Total number of users with active sessions today
      const threshold = new Date(Date.now() - 60 * 60 * 1000); // 60 minutes ago
      const activeSessionsToday = await Session.count({
        where: {
          createdAt: {
            [Op.gte]: threshold,
          },
        },
        distinct: true,
        col: "userId",
      });

      //  Average number of active session users in the last 7 days rolling
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const activeSessionsLast7Days = await Session.findAll({
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("COUNT", literal('DISTINCT "userId"')), "count"],
        ],
        where: {
          createdAt: {
            [Op.gte]: sevenDaysAgo,
            [Op.lt]: tomorrow,
          },
        },
        group: [fn("DATE", col("createdAt"))],
        raw: true,
      });

      const totalSessionsLast7Days = activeSessionsLast7Days.reduce(
        (acc, day) => acc + parseInt(day.count),
        0
      );
      const averageActiveSessionsLast7Days = totalSessionsLast7Days;

      res.status(200).json({
        total_users: totalUsers,
        active_today: activeSessionsToday,
        average_7_days: averageActiveSessionsLast7Days,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
