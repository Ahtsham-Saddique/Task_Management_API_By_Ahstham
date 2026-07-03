const Task = require("../models/tasks");
const Project = require("../models/projects");

// Create Task
const createTask = async (req, res) => {

    try {

        const { taskName, description, completed } = req.body;

        const project = await Project.findOne({

            _id: req.params.projectId,
            owner: req.user._id
            

        });

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project Not Found"

            });

        }

        const task = await Task.create({

            taskName,
            description,
            completed,

            project: project._id

        });

        res.status(201).json({

            success: true,
            task

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// Get Tasks of One Project
const getTasks = async (req, res) => {

    try {

        const project = await Project.findOne({

            _id: req.params.projectId,
            owner: req.user._id

        });

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project Not Found"

            });

        }

        const filter = {

            project: project._id

        };

        if (req.query.completed !== undefined) {

            filter.completed = req.query.completed === "true";

        }

        const tasks = await Task.find(filter);

        res.json({

            success: true,
            count: tasks.length,
            tasks

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// Update Task
const updateTask = async (req, res) => {

    try {

        const task = await Task.findByIdAndUpdate(

            req.params.taskId,

            req.body,

            {

                new: true,
                runValidators: true

            }

        );

        if (!task) {

            return res.status(404).json({

                success: false,
                message: "Task Not Found"

            });

        }

        res.json({

            success: true,
            task

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

};

// Delete Task
const deleteTask = async (req, res) => {

    try {

        await Task.findByIdAndDelete(req.params.taskId);

        res.json({

            success: true,
            message: "Task Deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

};

module.exports = {

    createTask,
    getTasks,
    updateTask,
    deleteTask

};