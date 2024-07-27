const jwt = require("jsonwebtoken");

// crete a token
const payloadToToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACESS_TOKEN_EXPIRES,
  });

// crete a token
const payloadToRefreshToken = (payload) =>
  jwt.sign(payload, process.env.process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });

// Verify the token
const tokenToPayload = (token) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

module.exports = { payloadToToken, tokenToPayload, payloadToRefreshToken };
