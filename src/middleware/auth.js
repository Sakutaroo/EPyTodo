const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.headers.authorization == null) {
        res.status(401).json({"msg":"No token, authorization denied"});
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token == null) {
        res.status(401).json({"msg":"No token, authorization denied"});
        return;
    }
    jwt.verify(token, process.env.SECRET, function (err, result) {
        if (err) {
            res.status(498).json({"msg":"Token is not valid"});
            return;
        }
        req.user = result.id;
        next();
    })
};
