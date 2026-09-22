const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "backend/.env" });

const app = express();



app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const issueRoutes = require("./routes/issue");
app.use("/api/issues", issueRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.json({ message: "CampusFix API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`CampusFix server running on http://localhost:${PORT}`);
});