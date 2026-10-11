const Comment = require("../models/Comment");
const { Complaint } = require("../models/Complaint");

exports.listComments = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).select("_id");

    if (!complaint) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comments = await Comment.find({ complaint: complaint._id })
      .populate("author", "fullName")
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({
        message: "Comment cannot exceed 500 characters",
      });
    }

    const complaint = await Complaint.findById(req.params.id)
      .select("_id status");

    if (!complaint) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (complaint.status === "cancelled") {
      return res.status(400).json({
        message: "Comments are disabled for cancelled issues",
      });
    }

    const comment = await Comment.create({
      complaint: complaint._id,
      author: req.user._id,
      text: text.trim(),
    });

    await comment.populate("author", "fullName");

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};