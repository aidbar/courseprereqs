const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const fs = require('fs');
const handlebars = require('express-handlebars');
const port = 3000;
app.use(express.static('public'));
var handlebarsHelpers = handlebars.create({
    helpers: {
        /*sayHello: function () { alert("Hello World") },
        getStringifiedJson: function (value) {
            return JSON.stringify(value);
        }*/
        dropdownChange:  function (value) {
            console.log("helper running.");
            console.log("value is " + value);
            return value;
        }
    }
    /*defaultLayout: 'main',
    partialsDir: ['views/partials/']*/
});
app.engine('handlebars', handlebarsHelpers.engine); //app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

/*engine().registerHelper('dropdownChange', function (value) {
    console.log("helper running.");
    console.log("value is " + value);
});*/

app.get('/', (req, res) => {
    console.log("app.get for /");
    //console.log(res);
    res.render('home', {layout: false});
    console.log("app.get for /, after render");
});

app.get('/api/data', (req, res) => {
    console.log("app.get for /api/data/")
    const data = [100, 50, 300, 40, 350, 250]; // assuming this is coming from the database
    res.json(data);
});

app.get('/data', (req, res) => {
    fs.readFile('./data/data.json', (err, courseDataResponse) => {
        if (err) throw err;
        const courseDataUnfiltered = JSON.parse(courseDataResponse);
        //console.log(courseDataUnfiltered);
        res.json(courseDataUnfiltered);
    });  
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});