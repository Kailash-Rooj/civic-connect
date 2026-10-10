const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ROLES = ["citizen", "admin"];
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  role: { type: String, enum: ROLES, required: true, default: "citizen" },
}, { timestamps: true });

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = { User: mongoose.model("User", userSchema), ROLES };
