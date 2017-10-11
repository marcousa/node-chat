const path = require('path');
const express = require('express');
var app = express();

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000

app.use(express.static(publicPath));

// ROUTES //

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});