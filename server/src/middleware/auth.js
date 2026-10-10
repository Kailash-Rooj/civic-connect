const { User } = require("../models/User");

async function requireAuth(req, res, next) {
  try {
    if (!req.session?.userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const user = await User.findById(req.session.userId);
    if (!user) {
      return req.session.destroy(() => {
        res.clearCookie("civicconnect.sid");
        res.status(401).json({ success: false, message: "Authentication required" });
      });
    }
    req.user = user;
    next();
  } catch (error) { next(error); }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "You do not have permission to access this resource" });
    next();
  };
}

async function optionalAuth(req, res, next) {
  try {
    if (!req.session?.userId) return next();

    const user = await User.findById(req.session.userId);
    if (user) req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAuth, requireRole, optionalAuth };
