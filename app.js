
const express = require("express");
const body = require("body-parser");
const mongo = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(express.static("public"));

mongo.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleschema = {
  title:String,
  content: String
}

const article = mongo.model("article",articleschema);


app.route("/articles")
//GET ALL ARTICLES FROM wikiDB
.get(function(req,res){
  article.find(function(err,result){
    if(!err){
      console.log(result);
    }
    else{
      console.log(err);
    }
  });
})

//CREATE ONE ARTICLE  IN wikiDB
.post(function(req,res){
  const newarticle = new article{
    title: req.body.title,    //TAKING THROUGH POSTMAN SOFTWARE
    content: req.body.content // AND NOT THROUGH FRONTEND
  }
  newarticle.save(function(err){
    if(!err){
      console.log("Success");
    }else{
      console.log(err);
    }
  });
})

//DELETE ALL ARTICLES IN wikiDB
.delete(function(req,res){
  article.deleteMany(function(err){
    if(!err){
      console.log("SUCCESS IN DELETING ALL ARTICELS");
    }
    else{
      console.log(err);
    }
  });
});





//FOR MORE SPECIFIC THAN JUST articles

app.route("/articles/:articleTitle")
.get(function(req,res){
  Title = req.params.articleTitle
  article.findOne({title: Title},function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
      console.log(foundarticle);
    }
    else{
      res.send("NO ARTICLES FOUND OF THAT NAME");
      console.log(err);
    }
  });
})

//PUT REQUEST UPDATES WHOLE OF IT AND IF WE DO NOT PROVIDE ARTICLE OR NAY ONE FIELD IT WILL DELETE
//THAT FIELD. TO OVERCOME WE USE PATCH
.put(function(req,res){
  article.update(
    {title:req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("SUCCESFULLY UPDATED");
      }
    }
  );
})

.patch(function(req,res){
  article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Success");
      }
    }
  )
})

.delete(function(req,res){
    article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Success Deleted");
        }
      }
    );
});

app.listen(4000,function(){
  console.log("Success");
});
