const express = require('express');
const app = express();
const db = require('../../config/db');
const {search_id, search_user, delete_user, search_user_email} = require('./user.query');
const logger = require('../../middleware/auth');
const check_id = require('../../middleware/notFound');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

module.exports = function(app) {
    app.get('/user', logger, function (req, res) {
        search_id(req.user, function (err, result) {
            if (err)
                res.status(500).json({"msg":"Internal server error"});
            else
                res.status(201).json(result[0]);
            return;
        })
    });
    app.get('/user/todos', logger, function (req, res) {
        search_user(function (err, result) {
            if (err)
                res.status(500).json({"msg":"Internal server error"});
            else
                res.status(201).json(result);
            return;
        })
    });
    app.put('/users/:id', logger, check_id, bodyParser.urlencoded({extended:false}), function (req, res) {
        let new_email = req.body.email;
        let new_password = req.body.password;
        let new_firstname = req.body.firstname;
        let new_name = req.body.name;
        let id = req.params.id;
        if (new_email === undefined || new_password === undefined || new_firstname === undefined || new_name === undefined) {
            res.status(500).json({"msg":"Internal server error"});
            return;
        }
        var salt = bcrypt.genSaltSync(10);
        new_password = bcrypt.hashSync(new_password, salt);
        db.query('UPDATE `user` SET `email` = ?, `password` = ?, `firstname` = ?, `name` = ? WHERE `id` = ?', [new_email, new_password, new_firstname, new_name, id], function (err, result) {
            if (err) {
                res.status(500).json({"msg":"Internal server error"});
                return;
            }
            search_id(id, function (err, result) {
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
    app.delete('/users/:id', logger, check_id, function (req, res) {
        let id = req.params.id;
        delete_user(id, function (err, result) {
            if (err) {
                res.status(500).json({"msg":"Internal server error"});
                return;
            }
            res.status(201).json({"msg":"Succesfully deleted record number: " + id});
            return;
        });
    });
    app.get('/users/:data', logger, bodyParser.urlencoded({extended:false}), function (req, res) {
        var data = req.params.data;
        if (isNaN(data)) {
            search_user_email(data, function (err, result) {
                if (err) {
                    res.status(500).json({"msg":"Internal server error"});
                    return;
                }
                if (result[0] == null) {
                    res.status(400).json({"msg":"Bad parameter"})
                    return;
                }
                res.status(201).json(result[0]);
                return;
            });
        } else {
            search_id(data, function (err, result) {
                if (err) {
                    res.status(500).json({"msg":"Internal server error"});
                    return;
                }
                if (result[0] == null) {
                    res.status(400).json({"msg":"Bad parameter"})
                    return;
                }
                res.status(201).json(result[0]);
                return;
            });
        }
    });
}
