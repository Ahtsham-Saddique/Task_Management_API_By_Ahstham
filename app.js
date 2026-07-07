
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const methodOverride = require("method-override");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const viewRoutes = require("./routes/viewRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());


app.use("/static", express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");
app.use("/", viewRoutes);
app.use("/admin", adminRoutes);

// Register Routes
app.use("/auth", authRoutes);
// Project Routes
app.use("/projects", projectRoutes);



app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("Task Management API Running...");
});

app.get("/profile", authMiddleware, (req, res) => {

    res.json({

        success: true,
        user: req.user

    });

});
const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);

module.exports = app;