const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
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

// const workItem = mongoose.model('workItem', itemsSchema);
// const witem1 = new workItem({
//   name: "Welcome"
// });
// const witem2 = new workItem({
//   name: "Hit + to create a new item!"
// });
// const witem3 = new workItem({
//   name: "<-- Hit here to delete them"
// });

const items = [item1, item2, item3];
//const workItems = [witem1, witem2, witem3];

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
      const day = date.getDate();
      res.render('list', {listTitle: day, newItems: foundItems});
    }  
  }); 
})

app.post('/', (req, res) => {
  const itemName = req.body.item;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect('/');
})

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if(!err) {
      console.log("Successfully deleted!")
    }
  });
  res.redirect('/');
})

// app.get('/work', (req, res) => { 
//   workItem.find({}, function(err, foundItems) {
//     if(foundItems.length == 0) {
//       workItem.insertMany(workItems, function(err) {
//         if(err) {
//           console.log(err);
//         }
//         else {
//           console.log('Default work items saved to DB!');
//         }
//       });
//       res.redirect("/work");
//     }
//     else {
//       res.render('list', {listTitle: "Work list", newItems: foundItems});
//     }  
//   });
// })

// app.post('/work', (req, res) => {
//   const itemName = req.body.item;
//   const item = new workItem({
//     name: itemName
//   });
//   item.save();
//   res.redirect('/work');
// })

app.get('/about', (req, res) => {  
  res.render('about');
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})