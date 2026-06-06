const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "No token provided"
      });

    }

    if (!authHeader.startsWith("Bearer ")) {

      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });

    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.admin = decoded;

    next();

  } catch (error) {

    console.log(error);

    res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};