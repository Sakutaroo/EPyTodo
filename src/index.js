const express = require('express');
const app = express();
require('dotenv').config()
require('./routes/auth/auth')(app)
require('./routes/user/user')(app)
require('./routes/todos/todos')(app)

app.listen(process.env.PORT, () => {
    console.log("Example app listening at http://localhost:%s", process.env.PORT);
});
