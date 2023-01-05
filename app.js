const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = [];
const workItems = [];

app.get('/', (req, res) => { 
    const day = date.getDate(); 
    res.render('list', {listTitle: day, newItems: items});
  })

  app.post('/', (req, res) => {
    if(req.body.list === "Work") {
      workItems.push(req.body.item);
      res.redirect('/work');
    }
    else {
      items.push(req.body.item);
      res.redirect('/');
    }
  })

  app.get('/work', (req, res) => {  
    res.render('list', {listTitle: "Work list", newItems: workItems});
  })

  app.post('/work', (req, res) => {
    workItems.push(req.body.item);

    res.redirect('/work');
  })

  app.get('/about', (req, res) => {  
    res.render('about');
  })
  
  app.listen(port, () => {
    console.log(`App running on port ${port}`)
  })