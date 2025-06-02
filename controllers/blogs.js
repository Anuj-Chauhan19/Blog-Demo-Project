const Blog = require("../models/blog");

module.exports.index = async (req, res) => {
    const allBlog = await Blog.find();
    res.render("./blogs/index.ejs", { allBlog, activePage: "explore", currUser: req.user });
  };

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("./blogs/new.ejs",{ activePage: "yourBlog", currUser: req.user });
  };

module.exports.showBlog = async (req, res) => {
    let { id } = req.params;
    const blog = await Blog.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!blog) {
      req.flash("error", "Blog you requested does not exist!!");
      res.redirect("/blogs");
    }
    console.log(blog);
    res.render("./blogs/show.ejs", { blog , activePage: "explore", currUser: req.user });
  };

module.exports.createBlog = async (req, res) => {
  
     let url = req.file.path;
  let filename = req.file.filename;

  if (!req.body.blog.description || req.body.blog.description.trim() === "") {
  req.flash("error", "Description is required!");
  return res.redirect("/blogs/new");
}

    const newBlog = new Blog(req.body.blog);
    newBlog.owner = req.user._id;
    newBlog.image = {url, filename};
    await newBlog.save();
    req.flash("success", "New Blog Created!!");
    // console.log(newBlog);
    res.redirect("/blogs");
  };



module.exports.updateBlog = async (req, res) => {
    let { id } = req.params;
    let blog = await Blog.findByIdAndUpdate(id, { ...req.body.blog });
    if(typeof req.file !== "undefined"){  
    let url = req.file.path;
  let filename = req.file.filename;
  blog.image = { url, filename};
  await blog.save();
    }
    req.flash("success", "Blog Updated!!");
    res.redirect(`/blogs/${id}`);
  };


module.exports.destroyBlog = async (req, res) => {
    let { id } = req.params;
    let deletedBlog = await Blog.findByIdAndDelete(id);
    req.flash("success", "Blog Deleted!!");
    res.redirect("/blogs");
  };