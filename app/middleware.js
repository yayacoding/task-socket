const jwt = require("jsonwebtoken");
const SecretKey = process.env.JWT_SECRET_KEY;
const { status: httpStatus } = require("http-status");
const generateToken = async (userData) => {
  try {
    const token = jwt.sign({ userId: userData.id }, SecretKey, {
      expiresIn: "4h",
    });
    return token;
  } catch (error) {
    console.log("TCL: generateToken -> error", error);
    return false;
  }
};

const verifyToken = async (req, res, next) => {
  try {
    let token = req?.headers["authorization"];
    if (!token) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "MISSING_TOKEN" });
    }
    token = token.replace("Bearer ", "");
    const decode = jwt.verify(token, SecretKey);
    if (!decode) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "INVALID_TOKEN" });
    }
    req.userData = decode;
    next();
  } catch (error) {
    console.log("TCL: generateToken -> error", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "SOMETHING_WENT_WRONG" });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
