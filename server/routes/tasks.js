const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/mauth");


//viewtask
router.get("/:projectId/tasks", async (req, res) => {
    try {
        const project_id = req.params.projectId;

        const projectCheck = await pool.query(
            `SELECT * FROM projects WHERE id = $1`,
            [project_id]
        );

        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }

        const result = await pool.query(
            `SELECT * FROM tasks
            WHERE project_id = $1
            ORDER BY id DESC`,
            [project_id]
        );
        
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// view one task
router.get("/:projectId/tasks/:taskId", async (req, res) => {
    try {
        const task_id = req.params.taskId;
        const project_id = req.params.projectId;
         const projectCheck = await pool.query(
            `SELECT * FROM projects WHERE id = $1`,
            [project_id]
        );

        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }

        const result = await pool.query(
            `SELECT * FROM tasks
             WHERE id = $1 AND project_id = $2`,
            [task_id, project_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

// post tasks
router.post("/:projectId/tasks", authMiddleware, async (req, res) => {
    try {
        const { name, description, due_date, status, priority } = req.body;
        const project_id = req.params.projectId;
        const user_id = req.user.userId;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const allowedStatus = ["todo", "inprogress", "done"];
        const finalStatus = status || "todo";

        if (!allowedStatus.includes(finalStatus)) {
            return res.status(400).json({
                error: "Status must be todo, inprogress, or done"
            });
        }

        const projectCheck = await pool.query(
            `SELECT * FROM projects 
             WHERE id = $1 AND user_id = $2`,
            [project_id, user_id]
        );

        if (projectCheck.rows.length === 0) {
            return res.status(403).json({
                error: "You can only create tasks in your own project"
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks 
            (name, description, due_date, status, priority, project_id, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                name,
                description || "",
                due_date || null,
                finalStatus,
                priority || "medium",
                project_id,
                user_id
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

//edit tasks
router.patch("/:projectId/tasks/:taskId/edit", authMiddleware, async (req, res) => {
    try {
        const project_id = req.params.projectId;
        const task_id = req.params.taskId;
        const user_id = req.user.userId;
        const { name, description, due_date, status, priority } = req.body;

        const allowedStatus = ["todo", "inprogress", "done"];

        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({
                error: "Status must be todo, inprogress, or done"
            });
        }

        const result = await pool.query(
            `UPDATE tasks
            SET 
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            due_date = COALESCE($3, due_date),
            status = COALESCE($4, status),
            priority = COALESCE($5, priority)
            WHERE id = $6 AND project_id = $7 AND user_id = $8
            RETURNING *`,
            [name, description, due_date || null, status, priority, task_id, project_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                error: "You can only edit tasks in your own project"
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//delete tasks
router.delete("/:projectId/tasks/:taskId/delete", authMiddleware, async (req, res) => {
    try {
        const project_id = req.params.projectId;
        const task_id = req.params.taskId;
        const user_id = req.user.userId;
                        //check if project exists
        const result = await pool.query(
            `DELETE FROM tasks
            WHERE id = $1 AND project_id = $2 AND user_id = $3
            RETURNING *`,
            [task_id, project_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                error: "You can only delete tasks in your own project"
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
