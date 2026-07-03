
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Login Page
router.get("/login", (req, res) => {

    res.render("auth/login");
   
});

// Register Page
router.get("/register", (req, res) => {

    res.render("auth/register");

});

const pageAuthMiddleware = require("../middleware/pageAuthMiddleware");


router.get("/dashboard", pageAuthMiddleware, (req, res) => {

    res.render("dashboard", {

        user: req.user

    });

});





router.get(
    "/projects/:projectId/tasks",
    authMiddleware,
    async (req, res) => {

        res.render("tasks", {

            user: req.user,
            projectId: req.params.projectId

        });

    }
);
router.get("/admin/dashboard", pageAuthMiddleware, (req, res) => {

    if (req.user.role !== "admin") {

        return res.status(403).send("Access Denied");

    }

    res.render("admin/dashboard", {

        user: req.user

    });

});


module.exports = router;


