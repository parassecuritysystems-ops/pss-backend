require("dotenv").config();

module.exports = (req, res, next) => {

  try {

    const superPassword = req.headers["superpassword"];

    if (!superPassword) {

      return res.status(401).json({
        success: false,
        message: "Super password required"
      });

    }

    if (superPassword !== process.env.SUPER_PASSWORD) {

      return res.status(401).json({
        success: false,
        message: "Invalid super password"
      });

    }

    next();

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};