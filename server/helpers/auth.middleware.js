import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Token required."
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
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