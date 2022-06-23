const express = require('express');
const app = express();
const db = require('../../config/db');
const {check_mail, create_user} = require('../user/user.query');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

module.exports = function(app) {
    app.post('/register', bodyParser.urlencoded({extended:false}), function (req, res) {
        let email = req.body.email;
        let name = req.body.name;
        let firstname = req.body.firstname;
        let password = req.body.password;
        if (email == undefined || password == undefined || firstname == undefined || name == undefined) {
            res.status(500).json({"msg":"Internal server error"});
            return;
        }
        const salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);
        check_mail(email, function (err, result) {
            if (result != "") {
                res.status(409).json({"msg":"Account already exists"});
                return;
            }
            create_user(email, name, firstname, password, function (err, result) {
                if (err) {
                    res.status(500).json({"msg":"Internal server error"});
                } else {
                    const token = jwt.sign(JSON.stringify({"id":result.insertId, "password":password}), process.env.SECRET);
                    res.status(201).json({"token":token});
                }
                return;
            })
        })
    });
    app.post('/login', bodyParser.urlencoded({extended:false}), function (req, res) {
        const temp_email = req.body.email;
        const temp_password = req.body.password;
        if (temp_email == undefined || temp_password == undefined) {
            res.status(500).json({"msg":"Internal server error"});
            return;
        }
        check_mail(temp_email, function (err, result) {
            if (result == "") {
                res.status(401).json({"msg":"Invalid Credentials"});
                return;
            }
            const password = result[0].password;
            const token = jwt.sign(JSON.stringify({"id":result[0].id, "password":temp_password}), process.env.SECRET);
            bcrypt.compare(temp_password, password, function(err, result) {
                if (result === true) {
                    res.status(201).json({"token":token});
                } else {
                    res.status(401).json({"msg":"Invalid Credentials"});
                }
                return;
            });
        })
    });
}
