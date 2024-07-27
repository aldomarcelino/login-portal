const jwt = require("jsonwebtoken");

// crete a token
const payloadToToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

// Verify the token
const tokenToPayload = (token) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

module.exports = { payloadToToken, tokenToPayload };
