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
module.exports = router;