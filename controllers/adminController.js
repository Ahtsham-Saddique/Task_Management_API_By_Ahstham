const User = require("../models/users");

const Project = require("../models/projects");
const Task = require("../models/tasks");

const adminDashboard = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments({
            role: "user"
        });

        const totalProjects = await Project.countDocuments();

        const totalTasks = await Task.countDocuments();

        res.render("admin/dashboard", {

            user: req.user,

            totalUsers,

            totalProjects,

            totalTasks

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).send("Internal Server Error");

    }

};



const getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({

            success: true,

            users

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



const deleteUser = async (req, res) => {

    try {

         if (req.user._id.toString() === req.params.id) {

    return res.status(400).json({

        success: false,
        message: "You cannot delete your own account."

            });

           }

        const userId = req.params.id;

        const projects = await Project.find({

            owner: userId

        });

        for (const project of projects) {

            await Task.deleteMany({

                project: project._id

            });

        }

        await Project.deleteMany({

            owner: userId

        });

        await User.findByIdAndDelete(userId);

        res.json({

            success: true,

            message: "User Deleted"

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
const getAllProjects = async (req, res) => {

    try {

        const projects = await Project.find()
            .populate("owner", "username email")
            .sort({ createdAt: -1 });

        res.json({

            success: true,

            projects

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

const deleteProject = async (req, res) => {

    try {

        await Task.deleteMany({
            project: req.params.id
        });

        const deletedProject = await Project.findByIdAndDelete(req.params.id);

        // If this request came from a server-rendered <form>, redirect back
        const referer = req.get("referer");
        if (referer) return res.redirect(referer);

        // Fallback: JSON for fetch/AJAX callers.
        return res.json({
            success: true,
            message: "Project Deleted",
            deletedProject
        });

    } catch (err) {
        console.log(err);

        const referer = req.get("referer");
        if (referer) return res.redirect(referer);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getUserProjects = async (req, res) => {

    try {

        const projects = await Project.find({

            owner: req.params.id

        })

            .populate("owner", "username email")

            .sort({ createdAt: -1 });

        res.json({

            success: true,

            projects

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const getProjectTasks = async (req, res) => {

    try {

        const tasks = await Task.find({

            project: req.params.id

        }).sort({ createdAt: -1 });

        res.json({

            success: true,

            tasks

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const deleteTaskAdmin = async (req, res) => {

    try {

        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        // If this request came from the server-rendered page, redirect back
        // so the user sees the refreshed page (no JSON handling needed).
        const referer = req.get("referer");
        if (referer) {
            return res.redirect(referer);
        }

        // Fallback: keep JSON response for fetch/AJAX callers.
        res.json({

            success: true,

            message: "Task Deleted",

            deletedTask

        });

    } catch (err) {

        console.log(err);

        const referer = req.get("referer");
        if (referer) {
            return res.redirect(referer);
        }

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};


// Render: Admin page - Projects for one user
const getUserProjectsPage = async (req, res) => {

    try {

        const [projects, targetUser] = await Promise.all([

            Project.find({

                owner: req.params.id

            }).sort({ createdAt: -1 }).populate('owner', 'username email role'),

            User.findById(req.params.id).select('username email role')

        ]);

        if (!targetUser) {

            return res.status(404).send("User Not Found");

        }

        res.render('admin/userProjects', {

            user: req.user,

            targetUser,

            projects

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).send("Internal Server Error");

    }

};

// Render: Admin page - Tasks for one project
const getProjectTasksPage = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id).populate('owner', 'username email role');

        if (!project) {

            return res.status(404).send("Project Not Found");

        }

        const tasks = await Task.find({

            project: req.params.id

        }).sort({ createdAt: -1 });

        res.render('admin/userProjectTasks', {

            user: req.user,

            project,

            tasks

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).send("Internal Server Error");

    }

};

module.exports = {

    adminDashboard,

    getAllUsers,

    deleteUser,

    getAllProjects,

    deleteProject,

    getUserProjects,

    getProjectTasks,

    deleteTaskAdmin,

    getUserProjectsPage,

    getProjectTasksPage,

};

