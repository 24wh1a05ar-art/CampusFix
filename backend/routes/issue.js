const express = require("express");
const Issue = require("../models/Issue");
const auth = require("../middleware/auth");

const router = express.Router();

console.log("ISSUE ROUTES LOADED");

router.get("/hello", (req, res) => {
    res.json({ message: "Issue route works" });
});

router.post("/", auth, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            priority
        } = req.body;

        const issue = await Issue.create({
            title,
            description,
            category,
            location,
            priority,
            reportedBy: req.user.userId
        });

        res.status(201).json({
            message: "Issue reported successfully",
            issue
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to report issue"
        });
    }
});

router.get("/my/:userId", auth, async (req, res) => {
    try {

        if (req.user.userId !== req.params.userId) {
            return res.status(403).json({
                message: "You can only view your own issues"
            });
        }

        const issues = await Issue.find({
            reportedBy: req.params.userId
        })
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.json(issues);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch your issues"
        });
    }
});

router.get("/", auth, async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        const issues = await Issue.find()
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.json(issues);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch issues"
        });
    }
});

router.put("/:id/status", auth, async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Resolved",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        res.json({
            message: "Issue status updated successfully",
            issue
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update issue status"
        });
    }
});

module.exports = router;