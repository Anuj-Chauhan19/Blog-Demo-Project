

const mongoose = require("mongoose");
const initData = require("./data");
const Blog = require("../models/blog");

const dbUrl ="mongodb://127.0.0.1:27017/blogs";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err.message);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Blog.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "683c4072cc07b76c067897a2",
  }));
  await Blog.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
