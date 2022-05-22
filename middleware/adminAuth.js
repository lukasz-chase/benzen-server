import jwt from "jsonwebtoken";

const secret = "test";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secret);
    req.role = decodedToken?.role;
    if (req.role === "admin" || req.role === "headAdmin") {
      next();
    } else {
      res.status(403).send("Unauthorized");
    }
  } catch (error) {
    console.log(error);
  }
};

export default adminAuth;
