var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/mongoose_dashboard');

var DogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    color: String
   }, {timestamps: true})
   mongoose.model('Dog', DogSchema); 
   var Dog = mongoose.model('Dog') 
   
app.get('/', function(req, res) {
    Dog.find({}, function(err, dogs) {
    res.render('index', {dog:dogs});
    })
})

app.get('/dogs/new', function(req, res) {
    res.render('new');
})

app.get('/dogs/:id', function(req, res) {
    console.log(req.params.id);
    Dog.findOne({_id:req.params.id},function(err,dog){
    console.log(dog);
    res.render('show', {dog:dog});
    })
})

app.post('/dogs/:id', function(req, res) {
    console.log(req.body)
        Dog.update({_id:req.params.id}, {
        name:req.body.name, breed:req.body.breed, color: req.body.color,
    },function(err,dog){
        if(err) {
            console.log('Something went wrong');
        } else {
            console.log('Successfully updated a dog!');
            res.redirect('/');
        }
    })
});

app.get('/dogs/edit/:id', function(req,res) {
    Dog.findOne({_id:req.params.id},function(err,dog){
    res.render('edit',{dog:dog})
    })
})


app.post('/dogs', function(req, res) {
    var dog = new Dog({id:req.params.id, name: req.body.name, breed: req.body.breed, color: req.body.color});
    dog.save(function(err,dog){
        if(err) {
            console.log('Something went wrong');
        } else {
            console.log('Successfully added a new dog!');
            res.redirect('/');
        }
    })
});

app.post('/dogs/delete/:id', function(req, res) {
        Dog.remove({_id:req.params.id}, function(err,dog){
        if(err) {
            console.log('Something went wrong');
        } else {
            console.log('Successfully deleted a dog!');
            res.redirect('/');
        }
    })
});

app.listen(8000)