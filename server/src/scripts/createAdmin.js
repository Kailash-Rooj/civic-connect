require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("../models/User");
(async () => {
  const [, , fullName, emailArg, password, phone] = process.argv;
  const email = (emailArg || "").toLowerCase();
  if (!fullName || !email || !password || !phone || password.length < 8) {
    console.error('Usage: npm run create-admin -- "Admin Name" admin@example.com password123 9876543210');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/civicconnect");
  let user = await User.findOne({ email }).select("+password");
  if (!user) user = new User({ fullName, email, password, phone, role: "admin" });
  else { user.fullName = fullName; user.password = password; user.phone = phone; user.role = "admin"; }
  await user.save();
  console.log(`Admin ready: ${user.email}`);
  await mongoose.disconnect();
})().catch(err => { console.error(err); process.exit(1); });
