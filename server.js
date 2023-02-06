const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000; //-------------------------
app.use(express.static('public'));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});