const { User } = require("../models/User");
const { toSafeUser } = require("../utils/user");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v) => typeof v === "string" ? v.trim() : "";

function createSession(req, user) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.userId = user._id.toString();
      req.session.role = user.role;
      req.session.save((saveErr) => saveErr ? reject(saveErr) : resolve());
    });
  });
}

async function register(req, res, next) {
  try {
    const fullName = clean(req.body.fullName), email = clean(req.body.email).toLowerCase(), phone = clean(req.body.phone);
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!fullName) return res.status(400).json({ success: false, message: "Full name is required" });
    if (!EMAIL_PATTERN.test(email)) return res.status(400).json({ success: false, message: "A valid email is required" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });
    const user = await User.create({ fullName, email, password, phone, role: "citizen" });
    await createSession(req, user);
    res.status(201).json({ success: true, user: toSafeUser(user) });
  } catch (err) { if (err.code === 11000) return res.status(409).json({ success: false, message: "An account with this email already exists" }); next(err); }
}

async function login(req, res, next) {
  try {
    const email = clean(req.body.email).toLowerCase(), password = typeof req.body.password === "string" ? req.body.password : "";
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    await createSession(req, user);
    res.json({ success: true, user: toSafeUser(user) });
  } catch (err) { next(err); }
}

function me(req, res) { res.json({ success: true, user: toSafeUser(req.user) }); }
function logout(req, res, next) { req.session.destroy((err) => { if (err) return next(err); res.clearCookie("civicconnect.sid"); res.json({ success: true }); }); }
module.exports = { register, login, me, logout };
