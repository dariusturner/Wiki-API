//jshint esversion:6

const express = require ("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

///////////////////////////////////////// Requests Targeting All Articles /////////////////////////////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      console.log(err);
    }
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully add a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany({}, function(err){
    if (!err){
      res.send("Successfully deleted articles!");
    } else {
      res.send(err);
    }
  });
});

///////////////////////////////////////// Requests Targeting A Specific Article /////////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No artciels matching that title was found.");
    }
  });
});

app.listen(port, function(){
  console.log("Server started on port " + port);
});
