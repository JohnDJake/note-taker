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

// Function to update the db file. Takes one parameter, update,
// which is a function that takes the saved notes as a parameter and returns
// the updated notes to save
function updateDb(update) {
    fs.readFile(dbPath, "utf8", (err, data) => {
        if (err) { console.error(err); }
        fs.writeFile(dbPath, JSON.stringify(update(JSON.parse(data))), err => {
            if (err) { console.error(err); }
        });
    });
}

// Set up API routes
app.get("/api/notes", (req, res) => res.sendFile(dbPath));
app.post("/api/notes", (req, res) => updateDb(notes => {
    const ids = notes.map(note => parseInt(note.id));
    let newId = 1;
    for (; ids.includes(newId); newId++);
    const newNote = { ...req.body, id: newId };
    res.json(newNote);
    notes.push(newNote);
    return notes;
}));
app.delete("/api/notes/:id", (req, res) => {
    updateDb(notes => notes.filter(note => note.id != req.params.id));
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