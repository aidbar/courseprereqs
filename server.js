const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const fs = require('fs');
const handlebars = require('express-handlebars');
const port = 3000;
app.use(express.static('public'));
var handlebarsHelpers = handlebars.create({
    helpers: {
        dropdownChange:  function (value) {
            console.log("helper running.");
            console.log("value is " + value);
            return value;
        }
    }
});
app.engine('handlebars', handlebarsHelpers.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    console.log("app.get for /");
    res.render('home', {layout: false});
    console.log("app.get for /, after render");
});

app.get('/data', (req, res) => {
    fs.readFile('./data/data.json', (err, courseDataResponse) => {
        if (err) throw err;
        const courseDataUnfiltered = JSON.parse(courseDataResponse);
        res.json(courseDataUnfiltered);
    });  
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});