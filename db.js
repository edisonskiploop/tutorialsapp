/**
 * Created by Edison on 31-08-2016.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tutorialsapp');
var userSchema = mongoose.Schema({
    name : String,
    password : String
});

var user = mongoose.model('users', userSchema);

user.find({name : 'abc'},function (err, users) {
    users[0].password = 'password';
    users[0].save(function (err) {
        console.log(err);
    });
});

// var users = [
//     new user({name: 'abc', password: 'pass'}),
//     new user({name: 'adeeadc', password: 'pass'}),
//     new user({name: 'safe', password: 'pass'}),
//     new user({name: 'fghgf', password: 'pass'}),
//     new user({name: 'rrger', password: 'pass'}),
//     new user({name: 'ukui', password: 'pass'}),
//     new user({name: 'vdfvd', password: 'pass'})
// ];

// users.forEach(function(user)
// {
//     user.save(function (err) {
//         if(err) console.log("Could not add user1");
//         else console.log('Added');
//     });
// });

//
// user.find(function (err, users) {
//     users.forEach(function(user)
//     {
//         console.log('ID : ' + user._id);
//         console.log('User : ' + user.name);
//         console.log('Password : ' + user.password + '\n-------------------');
//     });
// });

mongoose.model('users').find(function (err, users) {
    console.log(users);
});