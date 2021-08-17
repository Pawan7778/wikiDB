

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//TODO

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema);

///////Request targeting all the articles

app.route('/articles')

.get( (req, res) => {
    Article.find(function (err, foundArticles) {
        if (!err) {

            res.send(foundArticles);
        } else {
            res.send(err)
        }
    })
})

.post( (req, res) => {

    const newArticles = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticles.save((err) => {
        if(!err) {
            res.send("Sucessfully added new articles!");
        }else{
            res.send(err)
        }

    })
})

.delete((req, res) => {
    Article.deleteMany(function(err){
        if(!err) {
            res.send("Sucessfully deleted all the articles!");
        }else{res.send(err);}
    })
});


////Request targeting specific Article

app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
        if(!err){

            res.send(foundArticle)
        }else{
            res.send("no article found")
        }
    })
})

.put((req, res) => {
    Article.update(
        {
            title:req.params.articleTitle
        },
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite : true},
        function (err) {
            if(!err){
                res.send("Sucessfully update article")
            }
        }

    )
})



app.listen(3000, function () {
    console.log("Server started on port 3000");
});
