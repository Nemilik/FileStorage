const express = require('express');
const mainRoutes = require('./routes/index')
require('dotenv').config()

const app = express();

app.use(express.json());

app.use('/', mainRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port: ${port}`));