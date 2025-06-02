const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const Review = require("./comment");

const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        url: String,
        filename: String,
    },
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
},
createdAt:{
        type:Date,
        default: new Date()
    },
});

blogSchema.post("findOneAndDelete", async(blog)=>{
    if(blog){
        await Comment.deleteMany({_id : {$in: blog.comments}});
    }
    
})

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;