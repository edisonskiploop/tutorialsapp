/**
 * Created by Edison on 31-08-2016.
 */
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// app.locals.count = 0;
app.locals.courses = ['C Basics', 'C++ Concepts', 'Java Programming', 'Materialize CSS'];
app.locals.uid = 0;

app.use('/staticjs', express.static(path.join(__dirname + '/public/javascripts')));
app.use('/staticcss', express.static(path.join(__dirname + '/public/stylesheets')));
app.use(express.static(path.join(__dirname + '/public')));
app.use('/templates', express.static(path.join(__dirname + '/templates')));
app.use(bodyParser());

//DB
mongoose.connect('mongodb://localhost/tutorialsapp');
var userSchema = mongoose.Schema({
    username: String,
    password: String
});

var tutorialSchema = mongoose.Schema({
    title: String,
    uid: String
});

var chaptersSchema = mongoose.Schema({
    ChapterName: {type: String, default: ' '},
    Description: {type: String, default: 'Your Description..'},
    FileContent: {type: String, default: 'Enter URL'},
    FileType: {type: String, default: 0},
    tid: {type: String, default: ' '}
});

var user = mongoose.model('users', userSchema);
var tutorial = mongoose.model('tutorials', tutorialSchema);
var chapter = mongoose.model('chapters', chaptersSchema);

//ROUTING
app.listen(3000, function () {
    console.log('Server Running at 127.0.0.1:3000');
});

app.get('/', function (req, res) {
    app.locals.count++;
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/login', function (req, res) {
    //res.end(JSON.stringify({id: '57c6b4e3d242b3a039477d93'}) + '');

    user.find({name: req.query.username, password: req.query.password}, function (err, users) {
        console.log('Login Request Recieved..');
        if (users.length == 1) {
            app.locals.uid = users[0]._id;
            console.log(app.locals.uid);
            res.write(JSON.stringify({id: app.locals.uid}) + '');
            res.end();
        }
        else res.end(false);
    });
});

app.get('/gettutorials', function (req, res) {
    if (req.query.userid != 'undefined')
        app.locals.uid = req.query.userid;
    tutorial.find({uid: app.locals.uid}, function (err, tutorials) {
        var data = [];
        tutorials.forEach(function (tutorial) {
            data.push({id: tutorial._id, title: tutorial.title});
        });
        res.end(JSON.stringify(data) + '');
    });
});


app.get('/addtutorial', function (req, res) {
    var newTutorial = new tutorial({title: req.query.title, uid: req.query.userid});
    newTutorial.save(function (err) {
        if (err)
            res.end(false);
        else res.end('1');
    });
});


app.get('/getchapters', function (req, res) {
    if (req.query.tid != 'undefined')
        app.locals.tid = req.query.tid;
    chapter.find({tid: app.locals.tid}, function (err, chapters) {
        res.end(JSON.stringify(chapters) + '');
    });
});

app.get('/addchapter', function (req, res) {
    var newChapter = new chapter();
    newChapter.ChapterName = req.query.chaptername;
    newChapter.tid = req.query.tid;
    newChapter.save(function (err) {
        if (!err) {
            res.end(JSON.stringify(newChapter) + '');
        } else res.end(false);
    });
});

app.post('/updatechapter', function (req, res) {
    var chap = new chapter(req.body);
    console.log(chap);

    chapter.findOneAndUpdate({_id: chap._id}, chap, {upsert: true}, function (err, doc) {
        if (err) console.log('Error : ' + err);
        else res.write(JSON.stringify(chap) + '');
        res.end();
    });
});

app.get('/deletetutorial', function (req, res) {
    console.log('Delete ID : ' + req.query.tid);
    tutorial.remove({_id: req.query.tid}, function (err) {
        if (!err)
            res.end();
    });

    chapter.remove({tid: req.query.tid}, function (err) {
        if (!err)
            res.end();
    });
});

app.get('/deletechapter', function (req, res) {
    console.log('Delete ID : ' + req.query._id);
    chapter.remove({_id: req.query._id}, function (err) {
        if (!err)
            res.end();
    });
});

//404
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});