const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const taskController = require("../controllers/taskController");

router.post("/:projectId", authMiddleware, taskController.createTask);

router.get("/:projectId", authMiddleware, taskController.getTasks);

router.put("/:taskId", authMiddleware, taskController.updateTask);

router.delete("/:taskId", authMiddleware, taskController.deleteTask);

module.exports = router;