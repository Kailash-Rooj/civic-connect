function toSafeUser(user) {
  return { id: user._id.toString(), fullName: user.fullName, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt };
}
module.exports = { toSafeUser };
