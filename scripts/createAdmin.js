const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/users");

async function createAdmin() {

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        const existingAdmin = await User.findOne({

            email: "admin@gmail.com"

        });

        if (existingAdmin) {

            console.log("Admin already exists.");

            process.exit();

        }

        

        console.log("Admin created successfully.");

        process.exit();

    }

    catch (err) {

        console.log(err);

        process.exit();

    }

}

createAdmin();