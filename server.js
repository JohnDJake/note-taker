// Import express, fs and path
const express = require("express");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db/db.json");

// Configure express server
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up API routes
app.get("/api/notes", (req, res) => res.sendFile(dbPath));

// Set up HTML GET routes
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));
app.get("/assets/*", (req, res) => res.sendFile(path.join(__dirname, "public/assets", req.params["0"])));
app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

// Start the server
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    }
    console.log(`App listening on port ${PORT}`);
});