const express = require("express");
const app =express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/myUrlShortener");

const { UrlModel } = require('./models/urlshort'); 
app.set('view engine',"ejs");
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    let allUrl = UrlModel.find(function(err,result){
        res.render("home",{
            urlResult : result
        })

    })
    
});

app.post('/create',function (req,res){
    
    // Create a Short URL
    let urlShort = new UrlModel({
        longUrl : req.body.longurl,
        shortUrl : generateUrl()

    })

    urlShort.save(function(err,data){
        if(err) throw err;
        console.log(data);
        res.redirect('/');
    })


    // Store it in DB


});

function generateUrl(){
    var rndResult = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for(var i=0;i<5;i++){
        rndResult += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return rndResult;
}

app.get('/:urlId',function(req,res){
    UrlModel.findOne({shortUrl : req.params.urlId},function(err,data){
        if(err) throw err;
        res.redirect(data.longUrl);
    })
})
app.listen(3000,()=>{console.log('Port running')});