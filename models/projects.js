const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        stack: {
            type: String,
            required: true,
            trim: true
        },

        instruction: {
            type: String,
            required: true
        },

        deadline: {
            type: Date,
            required: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);