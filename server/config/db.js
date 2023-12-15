const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${(await conn).connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };
