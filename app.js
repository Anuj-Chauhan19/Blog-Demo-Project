// const dbUrl = process.env.ATLASDB_URL;
if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Blog = require("./models/blog.js");



const blogRouter = require("./routes/blog.js");
const commentRouter = require("./routes/comment.js");
const userRouter = require("./routes/user.js");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: process.env.SECRET,
//     },
//     touchAfter: 24*36000,
// });

// store.on("error",()=>{
//     console.log("Error in Mongo Session Store",err);
// });

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true, //  use for security 
    },
};





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  // means user login and signup

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});
 
const MONGO_URL = "mongodb://127.0.0.1:27017/blogs";



main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err.message);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

// app.get("/demouser", async(req,res)=>{
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username: "Anuj19",
//     });
//     let newUser = await User.register(fakeuser,"helloworld");
//     res.send(newUser);
// })


app.use("/blogs",blogRouter);
app.use("/blogs/:id/comments",commentRouter);
app.use("/",userRouter);

app.get("/",async (req,res)=>{
    try {
        const allBlog = await Blog.find({});
        res.render("blogs/index", { allBlog });
    } catch (e) {
        console.log(e);
        req.flash("error", "Cannot fetch blogs right now!");
        res.redirect("/");
    }
});



 
app.use((err,req,res,next)=>{
    let {status=500, message="Something Went wrong"} = err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
});