const mysql = require('mysql2');
require('dotenv').config;

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

connection.connect(function(req, res, err) {
    if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"msg" : "Internal server error"}, null, 3));
        return;
    }
    console.log("Connected!");
});
module.exports = connection;
