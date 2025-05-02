const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "member_scoreboard"
});

db.connect();

app.use(express.json());

const validateMember = (req, res, next) => {
    const { name, score, committee } = req.body;
    if (!name || !committee) return res.send('Name and committee are required');
    if (isNaN(score)) return res.send('Score must be a number');
    next();
};

app.post('/', validateMember, (req, res) => {
    const { name, score, committee } = req.body;
    const sql = "INSERT INTO members (name, score, committee) VALUES (?, ?, ?)";
    db.query(sql, [name, score, committee], () => {
        res.send("Member created successfully");
    });
});

app.get('/', (req, res) => {
    db.query("SELECT * FROM members", (err, results) => {
        res.json(results);
    });
});

app.patch('/:id', validateMember, (req, res) => {
    const { name, score, committee } = req.body;
    const sql = "UPDATE members SET name = ?, score = ?, committee = ? WHERE id = ?";
    db.query(sql, [name, score, committee, req.params.id], () => {
        res.send("Member updated successfully");
    });
});

app.delete('/:id', (req, res) => {
    const sql = "DELETE FROM members WHERE id = ?";
    db.query(sql, [req.params.id], () => {
        res.send("Member deleted successfully");
    });
});

app.listen(8000, () => {
    console.log(`Server running on http://localhost:8000`);
});