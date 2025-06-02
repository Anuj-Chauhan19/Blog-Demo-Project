const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const commentSchema = new Schema({
    comment:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: new Date()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Comment",commentSchema);