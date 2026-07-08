const mongoose = require("mongoose");

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        const err = new Error("Server misconfigured: MONGODB_URI is not set");
        err.status = 500;
        throw err;
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("Database Connection Failed");
        console.error(err.message);
        throw err;
    }
};

module.exports = connectDB;
