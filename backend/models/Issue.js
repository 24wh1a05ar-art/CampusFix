const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: [
                "Wi-Fi",
                "Electrical",
                "Water",
                "Hostel",
                "Classroom",
                "Laboratory",
                "Cleaning",
                "Other"
            ],
            required: true
        },

        location: {
            type: String,
            required: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved", "Rejected"],
            default: "Pending"
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Issue", issueSchema);