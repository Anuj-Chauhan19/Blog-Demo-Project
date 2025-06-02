const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Blog = require("../models/blog");
const { isLoggedIn, isOwner, validateBlog } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

const blogController = require("../controllers/blogs.js");


// New route

router.get("/new", isLoggedIn, blogController.renderNewForm);

router
  .route("/")
  .get(wrapAsync(blogController.index))
  .post(
    isLoggedIn,
    upload.single('blog[image]'),
    wrapAsync(blogController.createBlog)
  );


router
  .route("/:id")
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(blogController.destroyBlog)
  )
  .get( wrapAsync(blogController.showBlog));

router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(blogController.renderEditForm)
);

module.exports = router;
