const serverless = require("serverless-http");

const app = require("../app");
const connectDB = require("../config/db");

const handler = serverless(app);

let isConnected = false;

async function connect() {
    if (isConnected) return;
    await connectDB();
    isConnected = true;
    console.log("MongoDB Connected");
}

module.exports = async (req, res) => {
    await connect();
    return handler(req, res);
};
