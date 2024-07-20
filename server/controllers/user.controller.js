const {
  payloadToToken,
  tokenToPayload,
} = require("../helpers/token-generator");
const { compareThePass } = require("../helpers/encryption");
const { User } = require("../models");
const { sendVerificationEmail } = require("../helpers/email-verification");
const { OAuth2Client } = require("google-auth-library");

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
    } catch (err) {
      next(err);
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
      await user.save();

      // Generate access token
      const access_token = payloadToToken({ id });

      // Send response
      res
        .status(200)
        .json({ message: "Account verified successfully", access_token });
    } catch (err) {
      next(err);
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
    } catch (e) {
      next(e);
    }
  }

  static async signInWithGoogle(req, res, next) {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: req.headers.google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          full_name: `${payload.given_name} ${payload.family_name}`,
          email: payload.email,
          password: "Bismillah",
          phone_number: "+62",
        },
      });

      let access_token = payloadToToken({
        id: user.id,
        email: user.email,
      });

      delete user.password;

      res.status(200).json({ access_token, user, img: payload.picture });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
