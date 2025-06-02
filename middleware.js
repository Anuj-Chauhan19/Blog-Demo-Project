const Blog = require("./models/blog");
const ExpressError = require("./utils/ExpressError");
const { blogSchema, commentSchema } = require("./schema.js");
const Comment = require("./models/comment.js");

module.exports.isLoggedIn = (req,res,next) => {

    if(!req.isAuthenticated()){
      // redirect Url
      req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create blog!");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let blog = await Blog.findById(id);
    if(!blog.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not owner of this blog!");
      return res.redirect(`/blogs/${id}`);
    }
    next();
}

module.exports.validateBlog = (req,res,next) =>{
  let {error} = blogSchema.validate(req.body);

  if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
   }
   else{
      next();
   }
};

module.exports.validateComment = (req,res,next) =>{
  let {error} = commentSchema.validate(req.body);

  if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
   }
   else{
      next();
   }
};

module.exports.isCommentAuthor = async (req, res, next) => {
  let { id, commentId } = req.params;
  let comment = await Comment.findById(commentId);
    if(!comment.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not author of this comment!");
      return res.redirect(`/blogs/${id}`);
    }
    next();
}