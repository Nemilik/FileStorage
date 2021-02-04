const express = require('express');
const mainRoutes = require('./routes/index');
const fileRoutes = require('./routes/file');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors());
require('./middleware/passport')(passport);

app.use('/', mainRoutes);
app.use('/file', fileRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port: ${port}`));
