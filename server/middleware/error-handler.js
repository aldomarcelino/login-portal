const errorHandler = async (err, req, res, next) => {
  console.log(err, "<====error");
  switch (err.name) {
    case "SequelizeValidationError":
      res.status(400).json({ message: err.errors.map((e) => e.message) });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors.map((e) => e.message) });
      break;
    case "JsonWebTokenError":
      res.status(401).json({ message: "Invalid Token" });
      break;
    case "Not_Valid":
      res.status(401).json({ message: "Email or password is invalid" });
      break;
    case "token_expired":
      res.status(400).json({ message: "Link verification is expired" });
      break;
    case "empty":
      res.status(400).json({ message: "Required Email or Password" });
      break;
    case "Forbidden":
      res.status(403).json({ message: "Not Authorize" });
      break;
    case "Not Found":
      res.status(404).json({ message: "Data Not Found" });
      break;
    default:
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

module.exports = errorHandler;
