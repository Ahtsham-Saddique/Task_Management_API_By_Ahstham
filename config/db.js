const mongoose = require("mongoose");

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("Database Connection Failed");
        console.error(err.message);
        throw err;
    }
};

module.exports = connectDB;