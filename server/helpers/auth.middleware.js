import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const requireAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Token required."
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

const user = await User.findById(decoded._id);

if (!user) {
  return res.status(401).json({
    message: "User not found."
  });
}

req.auth = {
  _id: user._id,
  role: user.role
};

next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};
export const requireOwner = (req, res, next) => {
  if (String(req.auth._id) !== String(req.params.userId)) {
    return res.status(403).json({
      message: "Access denied. You can only modify your own account."
    });
  }
  next();
};
export default requireAuth;
export const requireAdmin = (req, res, next) => {
  if (req.auth?.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
};