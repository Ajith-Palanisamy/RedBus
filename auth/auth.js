const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token =req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.send("Required Token");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOC);
    console.log(decoded);
    req.user = decoded.email;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;