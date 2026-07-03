const Project = require("../models/projects");
const Task = require("../models/tasks");



const createProject = async (req, res) => {
  console.log(req.body);
    try {

        const { title, stack, instruction, deadline } = req.body;

        const project = await Project.create({

          title,
          stack,
          instruction,
          deadline,
          owner: req.user._id

});

        res.status(201).json({

            success: true,
            message: "Project Created Successfully",

            project

        });

    }

    catch (err) {

        

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};
const getAllProjects = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const search = req.query.search || "";

        const query = {

            owner: req.user._id,

           title: {
              $regex: search,
              $options: "i"
                  }

        };

        const total = await Project.countDocuments(query);

        const projects = await Project.find(query)

            .skip(skip)

            .limit(limit)

            .sort({

                createdAt: -1

            });

        res.json({

            success: true,

            page,

            total,

            totalPages: Math.ceil(total / limit),

            projects

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

};
const getProjectById = async (req, res) => {

    try {

        const project = await Project.findOne({

            _id: req.params.id,
            owner: req.user._id

        });

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project Not Found"

            });

        }

        res.status(200).json({

            success: true,
            project

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
const updateProject = async (req, res) => {

    try {

        const project = await Project.findOneAndUpdate(

            {

                _id: req.params.id,
                owner: req.user._id

            },

            req.body,

            {

                new: true,
                runValidators: true

            }

        );

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project Not Found"

            });

        }

        res.status(200).json({

            success: true,
            message: "Project Updated Successfully",
            project

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

        const project = await Project.findOneAndDelete({

            _id: req.params.id,
            owner: req.user._id

        });

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project Not Found"

            });

        }

        await Task.deleteMany({

            project: project._id

        });

        res.json({

            success: true,
            message: "Project And Its Tasks Deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

};


module.exports = {

    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject

};