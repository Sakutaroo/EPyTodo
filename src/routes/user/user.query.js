const db = require('../../config/db');

exports.check_mail = function (email, callback) {
    db.query('SELECT * FROM user WHERE email = ?', [email], function (err, result) {
        return callback(err, result);
    })
}

exports.create_user = function (email, name, firstname, password, callback) {
    db.query('INSERT INTO `user` (`email`, `password`, `name`, `firstname`) VALUES (?, ?, ?, ?)', [email, password, name, firstname], function (err, result) {
        return callback(err, result);
    })
}

exports.search_id = function (id, callback) {
    db.query('SELECT * FROM user WHERE id = ?', [id], function (err, result) {
        return callback(err, result);
    })
}

exports.search_user = function (callback) {
    db.query('SELECT * FROM todo', function (err, result) {
        return callback(err, result);
    })
}

exports.search_user_email = function (email, callback) {
    db.query('SELECT * FROM user WHERE email = ?', [email], function (err, result) {
        return callback(err, result);
    })
}

exports.delete_user = function (id, callback) {
    db.query('DELETE FROM user WHERE id = ?', [id], function (err, result) {
        return callback(err, result);
    })
}
