const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Comment = require("../models/comment.js");
const Blog = require("../models/blog");
const {
  validateComment,
  isLoggedIn,
  isCommentAuthor,
} = require("../middleware.js");

const commentController = require("../controllers/comments.js");

router.post(
  "/",
  isLoggedIn,
  validateComment,
  wrapAsync(commentController.createComment)
);

// Delete Comment route

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthor,
  wrapAsync(commentController.destroyComment)
);

module.exports = router;
