const db = require('../config/db');

module.exports = (req, res, next) => {
    var id = req.params.id;

    if (id) {
        db.execute('SELECT * FROM `todo` WHERE id = ?', [id], function(err, results, fields) {
            if (results == "") {
                res.status(404).json({"msg":"Not found"});
                return;
            }
            next();
        });
    } else {
        res.status(500).json({"msg":"Internal server error"});
        return;
    }
};
