const jwt = require("jsonwebtoken");

const payloadToToken = (payload) =>
  jwt.sign(payload, process.env.PUBLIC_RESTURL_KEY);
const tokenToPayload = (token) =>
  jwt.verify(token, process.env.PUBLIC_RESTURL_KEY);

module.exports = { payloadToToken, tokenToPayload };
