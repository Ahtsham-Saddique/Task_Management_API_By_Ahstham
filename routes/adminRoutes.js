const express = require("express");

const router = express.Router();

const pageAuthMiddleware = require("../middleware/pageAuthMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");

router.get(
    "/users",
    pageAuthMiddleware,
     adminMiddleware,
    adminController.getAllUsers
);
router.delete(
    "/projects/:id",
    pageAuthMiddleware,
    adminMiddleware,
    adminController.deleteProject
);

// Fallback for cases where the client sends POST (e.g. method-override not applied)
// Only allow deletion if the request explicitly indicates DELETE.
router.post(
    "/projects/:id",
    pageAuthMiddleware,
    adminMiddleware,
    (req, res, next) => {
        if (req.body && req.body._method === "DELETE") return next();
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    },
    adminController.deleteProject
);

router.delete(
    "/users/:id",
    pageAuthMiddleware,
     adminMiddleware,
    adminController.deleteUser
);


router.get(
    "/projects",
    pageAuthMiddleware,
    adminMiddleware,
    adminController.getAllProjects
);

router.get(
    "/users/:id/projects",
    pageAuthMiddleware,
    adminMiddleware,
    adminController.getUserProjectsPage
);


router.get(
    "/projects/:id/tasks",
    pageAuthMiddleware,
    adminMiddleware,
    adminController.getProjectTasks
);

router.post(
    "/tasks/:id",
    pageAuthMiddleware,
    adminMiddleware,
    (req, res, next) => {
        if (req.body && req.body._method === "DELETE") return next();
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    },
    adminController.deleteTaskAdmin
);

router.delete(
    "/tasks/:id",
    pageAuthMiddleware,
    adminMiddleware,
    adminController.deleteTaskAdmin
);


module.exports = router;
