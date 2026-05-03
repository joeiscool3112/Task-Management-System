const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/mauth");

//--------- projects----------
//view all projects 
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
            projects.*,
            users.username
            FROM projects
            JOIN users 
            ON projects.user_id = users.id
            ORDER BY projects.id DESC;`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//view one project
router.get("/:id", async (req, res) => {
    try {
        const project_id = req.params.id;

        const result = await pool.query(
            `SELECT 
            projects.*,
            users.username
            FROM projects
            JOIN users
            ON projects.user_id = users.id
            WHERE projects.id = $1`,
            [project_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//post projects
router.post("/", authMiddleware, async (req, res) => {
    const { name, description, color } = req.body;
    const user_id = req.user.userId;

    try {
        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required" });
        }

        const result = await pool.query(
            `INSERT INTO projects (name, description, color, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [name, description, color || "#3b82f6", user_id]
        );

        const createdProject = await pool.query(
            `SELECT 
            projects.*,
            users.username
            FROM projects
            JOIN users
            ON projects.user_id = users.id
            WHERE projects.id = $1`,
            [result.rows[0].id]
        );

        res.status(201).json(createdProject.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}); 

//edit projects
router.patch("/:id/edit", authMiddleware, async (req, res) => {
    const { name, description, color } = req.body;
    const user_id = req.user.userId;
    const project_id = req.params.id;

    try {
        const result = await pool.query(
            `UPDATE projects
            SET 
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            color = COALESCE($3, color)
            WHERE id = $4 AND user_id = $5
            RETURNING *`,
            [name, description, color, project_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "You can only edit your own projects" });
        }

        const updatedProject = await pool.query(
            `SELECT 
            projects.*,
            users.username
            FROM projects
            JOIN users
            ON projects.user_id = users.id
            WHERE projects.id = $1`,
            [project_id]
        );

        res.json(updatedProject.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//delete projects
router.delete("/:id/delete", authMiddleware, async (req, res) => {
    try {
        const project_id = req.params.id;
        const user_id = req.user.userId;

        const result = await pool.query(
            `DELETE FROM projects
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [project_id, user_id]
        );

        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
//----------------------------------


module.exports = router;
