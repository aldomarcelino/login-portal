const { tokenToPayload } = require("../helpers/token-generator");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    // Get access token
    const { authorization } = req.headers;
    if (!authorization) throw { name: "empty_token" };

    const token = authorization.split(" ")[1];
    if (!token) throw { name: "JsonWebTokenError" };
    let payload = tokenToPayload(token);

    // Check if user is exist
    let user = await User.findByPk(payload.id, { raw: true });
    if (!user) throw { name: "Not_Valid" };

    // Remove password
    delete user.password;

    // Save to req
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
