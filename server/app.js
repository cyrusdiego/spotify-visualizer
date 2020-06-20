const express = require('express'); // Express web server framework
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();

app.use(cors()).use(cookieParser());
require('./routes/login')(app);
require('./routes/callback')(app);
require('./routes/refresh')(app);
console.log('Listening on 8888');
app.listen(8888);
