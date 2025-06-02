const Comment = require("../models/comment");
const Blog = require("../models/blog");

module.exports.createComment = async(req,res)=>{
    // console.log(req.params.id);
    let blog = await Blog.findById(req.params.id);
    let newComment = new Comment(req.body.comment);
    newComment.author = req.user._id;
    console.log(newComment);
    blog.comments.push(newComment);

    await newComment.save();
    await blog.save();
    req.flash("success","New Comment Created!!");
    // console.log("new comment saved");
    res.redirect(`/blogs/${blog._id}`);
};

module.exports.destroyComment = async(req,res)=>{
    let {id, commentId } = req.params;
    await Blog.findByIdAndUpdate(id, {$pull: {comments: commentId}});
    await Comment.findByIdAndDelete(commentId);
    req.flash("success","Comment Deleted!!");
    res.redirect(`/blogs/${id}`);
};