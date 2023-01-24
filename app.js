const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname + "/date.js");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Creates Database
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');
mongoose.set('strictQuery', false);

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({
  name: "Welcome"
});
const item2 = new Item({
  name: "Hit + to create a new item!"
});
const item3 = new Item({
  name: "<-- Hit here to delete them"
});

const items = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {
  Item.find({}, function(err, foundItems) {
    if(foundItems.length == 0) {
      Item.insertMany(items, function(err) {
        if(err) {
          console.log(err);
        }
        else {
          console.log('Default items saved to DB!');
        }
      });
      res.redirect("/");
    }
    else {
      res.render('list', {listTitle: "Today", newItems: foundItems});
    }  
  }); 
})

app.get('/:customListName', (req, res) => { 
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName}, function(err, foundList){
    if(!err) {
      if(!foundList){
        const list = new List({
          name: customListName,
          items: items
        });
        list.save();
        res.redirect('/' + customListName);
      }
      else {
        res.render('list', {listTitle: foundList.name, newItems: foundList.items});
      }
    }
    else {
      console.log(err);
    }
  });
})

app.post('/', (req, res) => {
  const itemName = req.body.item;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect('/');
  }
  else{
    List.findOne({name:listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    });
  }
})

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if(!err) {
        console.log("Successfully deleted!");
        res.redirect('/');
      }
    });
  }
  else {
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
      if(!err) {
        res.redirect('/' + listName);
      }
    });
  }
})

app.get('/about', (req, res) => {  
  res.render('about');
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})