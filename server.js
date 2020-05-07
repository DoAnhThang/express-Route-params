const express = require("express");
const app = express();

var bodyParser = require("body-parser");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const shortid = require("shortid");

// Set some defaults
db.defaults({ books: [] }).write();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',function(req,res){
  res.render('index')
})

app.get('/books', function(req, res) {
  res.render("books", {
    books: db.get("books").value()
  });
});

app.post('/books',function(req,res){
  req.body.id = shortid.generate();
  db.get('books')
    .push(req.body)
    .write()
  res.redirect('back')
})

app.get('/books/:id/update', function(req,res){
  var id = req.params.id;
  res.render('update-title',{
    id:id
  })
})

app.post('/books/update', function(req,res){
  db.get('books')
    .find({id: req.body.id})
    .assign({title: req.body.title})
    .write()
  res.redirect('/books')
})

app.get('/books/:id/delete', function(req,res){
  var id = req.params.id;
  db.get('books')
    .remove({id:id})
    .write()
  res.redirect('back')
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
