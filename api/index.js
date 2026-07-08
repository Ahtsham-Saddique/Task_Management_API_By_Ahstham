const serverless = require("serverless-http");

const app = require("../app");
const connectDB = require("../config/db");


const handler = serverless(app);



let isConnected = false;

// Connect to MongoDB only once
async function connect() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
        console.log("MongoDB Connected");
    }
}


module.exports = async (req, res) => {
    await connectDB();
    return handler(req, res);
};