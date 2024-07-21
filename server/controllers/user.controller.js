const {
  payloadToToken,
  tokenToPayload,
} = require("../helpers/token-generator");
const { compareThePass, hashThePassword } = require("../helpers/encryption");
const { User } = require("../models");
const { sendVerificationEmail } = require("../helpers/email-verification");
const { OAuth2Client } = require("google-auth-library");
const passport = require("passport");
const { Strategy: FacebookStrategy } = require("passport-facebook");

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

      // Generate access token
      const access_token = payloadToToken({ id });

      // Send response
      res.status(200).json({
        access_token,
        user: { full_name: user.full_name, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  }

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

      // Generate token
      const access_token = payloadToToken({
        id: user.id,
        email: user.email,
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
      const [user, created] = await User.findOrCreate({
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
      let access_token = payloadToToken({
        id: user.id,
        email: user.email,
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

  static async logOut(req, res, next) {
    try {
      const { id } = req.user;

      // Find user by ID
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update is_login to false
      user.is_login = false;
      await user.save();

      // Send response
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }

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

  static async signInWithFacebook(req, res, next) {
    passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
  }

  static async facebookCallback(req, res, next) {
    passport.authenticate("facebook", { session: false }, (err, data, info) => {
      if (err) return next(err);
      if (!data) return res.redirect(`${process.env.CLIENT_URL}/login`);

      const { token, user } = data;
      res.redirect(
        `${process.env.CLIENT_URL}/auth?token=${token}&full_name=${user.full_name}&email=${user.email}`
      );
    })(req, res, next);
  }

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
}

module.exports = UserController;
