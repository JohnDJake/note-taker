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
app.post("/api/notes", (req, res) => fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) { console.error(err); }
    const notes = JSON.parse(data);
    const ids = notes.map(note => parseInt(note.id));
    let newId = 1;
    for (; ids.includes(newId); newId++);
    const newNote = { ...req.body, id: newId };
    notes.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(notes), err => {
        if (err) { console.error(err); }
    });
    res.json(newNote);
}));
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile(dbPath, "utf8", (err, data) => {
        if (err) { console.error(err); }
        const notes = JSON.parse(data);
        const remainingNotes = notes.filter(note => note.id != req.params.id);
        fs.writeFile(dbPath, JSON.stringify(remainingNotes), err => {
            if (err) { console.error(err); }
        });
    });
    res.end();
});

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