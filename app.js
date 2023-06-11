//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const encrypt=require('mongoose-encryption') 
const app = express();
// console.log(process.env.API_KEY)

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(
  "mongodb+srv://dimple:user123@cluster1.1oghapq.mongodb.net/usersDB"
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.route('/login')
.get((req,res)=>{
    res.render("login");
})
.post((req,res)=>{
   const username=req.body.username;
   const password=req.body.password; 
   User.findOne({email:username}).then((foundUser)=>{
  
        if(foundUser.password===password){
            res.render('secrets')
        }
        else{
            console.log('not found')
        }
    
   })
})

app.route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save().then(() => {
      res.render("secrets");
    });
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
