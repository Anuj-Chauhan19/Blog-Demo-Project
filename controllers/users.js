const User = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("./users/signup", { activePage: "signup", currUser: req.user });
  };

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","Welcome to Blog(Web)");
        res.redirect("/blogs");
      })
      // console.log(registeredUser);
      // req.flash("success", "Welcome to Blog(Web)");
      // res.redirect("/blogs");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

module.exports.loginForm =  (req, res) => {
    res.render("./users/login.ejs", { activePage: "login", currUser: req.user });
  };

module.exports.login = async (req, res) => {
    req.flash("success","Welcome back to Blog(Web)");
    let redirectUrl = res.locals.redirectUrl || "/blogs";
    res.redirect(redirectUrl);
  };

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","You are logged out now!");
      res.redirect("/blogs");
  
    })
  };