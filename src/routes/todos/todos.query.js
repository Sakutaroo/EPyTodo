const db = require('../../config/db');

exports.create_todo = function (title, description, due_time, user_id, status, callback) {
    db.query('INSERT INTO `todo` (`title`, `description`, `due_time`, `user_id`, `status`) VALUES (?, ?, ?, ?, ?)', [title, description, due_time, user_id, status], function (err, result) {
        return callback(err, result);
    })
}

exports.search_todo_id = function (id, callback) {
    db.query('SELECT * FROM todo WHERE id = ?', [id], function (err, result) {
        return callback(err, result);
    })
}

exports.search_todos = function (callback) {
    db.query('SELECT * FROM todo', function (err, result) {
        return callback(err, result);
    })
}

exports.delete_todo = function (id, callback) {
    db.query('DELETE FROM todo WHERE id = ?', [id], function (err, result) {
        return callback(err, result);
    })
}
