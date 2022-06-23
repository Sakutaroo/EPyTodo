const express = require('express');
const app = express();
const db = require('../../config/db');
const bodyParser = require('body-parser');
const logger = require('../../middleware/auth');
const check_id = require('../../middleware/notFound');
const {create_todo, search_todo_id, search_todos, delete_todo} = require('./todos.query');

app.use(express.json());

module.exports = function(app) {
    app.post('/todos', logger, bodyParser.urlencoded({extended:false}), function (req, res) {
        let title = req.body.title;
        let description = req.body.description;
        let due_time = req.body.due_time;
        let user_id = req.body.user_id;
        let status = req.body.status;
        if (title === undefined || status === undefined || user_id === undefined || due_time === undefined || description === undefined) {
            res.status(500).json({"msg":"Internal server error"});
            return;
        }
        if (status == "") {
            status = "not started";
        }
        create_todo(title, description, due_time, user_id, status, function (err, result) {
            if (err) {
                res.status(500).json({"msg":"Internal server error"});
            } else {
                search_todo_id(result.insertId, function (err, result) {
                    if (err) {
                        res.status(500).json({"msg":"Internal server error"});
                    } else
                        res.status(201).json(result[0]);
                    return;
                });
            }
            return;
        })
    });
    app.get('/todos', logger, function (req, res) {
        search_todos(function (err, result) {
            if (err)
                res.status(500).json({"msg":"Internal server error"});
            else
                res.status(201).json(result);
            return;
        })
    });
    app.delete('/todos/:id', logger, check_id, bodyParser.urlencoded({extended:false}), function (req, res) {
        let id = req.params.id;
        delete_todo(id, function (err, result) {
            if (err) {
                res.status(500).json({"msg":"Internal server error"});
                return;
            }
            res.status(201).json({"msg":"Succesfully deleted record number: " + id});
            return;
        });
    });
    app.put('/todos/:id', logger, check_id, bodyParser.urlencoded({extended:false}), function (req, res) {
        let new_title = req.body.title;
        let new_description = req.body.description;
        let new_due_time = req.body.due_time;
        let new_user_id = req.body.user_id;
        let new_status = req.body.status;
        if (new_title === undefined || new_status === undefined || new_user_id === undefined || new_due_time === undefined || new_description === undefined) {
            res.status(500).json({"msg":"Internal server error"});
            return;
        }
        if (new_status == "")
            new_status = "not started";
        let id = req.params.id;
        db.query('UPDATE `todo` SET `title` = ?, `description` = ?, `due_time` = ?, `user_id` = ?, `status` = ? WHERE `id` = ?', [new_title, new_description, new_due_time, new_user_id, new_status, id], function (err, result) {
            if (err) {
                res.status(500).json({"msg":"Internal server error"});
                return;
            }
            search_todo_id(id, function (err, result) {
                if (err) {
                    res.status(500).json({"msg":"Internal server error"});
                    return;
                }
                res.status(201).json(result[0]);
                return;
            });
            return;
        });
    });
    app.get('/todos/:id', logger, check_id, bodyParser.urlencoded({extended:false}), function (req, res) {
        let id = req.params.id;
        search_todo_id(id, function (err, result) {
            if (err) {
                res.status(500).json({"msg":"Internal server error"});
                return;
            }
            res.status(201).json(result[0]);
            return;
        });
    });
}
