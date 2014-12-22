var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    displayName: String,
    firstname: String,
    lastname: String,
    id : String
})

var lessonSchema = mongoose.Schema({
    id : Number,
    title : String,
    questions : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
})

var questionSchema = mongoose.Schema({
	text : String,
	answer : String,
	_lesson : { type: Number, ref: 'Lesson' }
})

var User = mongoose.model('User', userSchema)
var Lesson = mongoose.model('Lesson', lessonSchema)
var Question = mongoose.model('Question', questionSchema)

mongoose.connect('mongodb://jenyckee:a6*7912S@ds027521.mongolab.com:27521/grotestromingen');

exports.Lesson = Lesson;
exports.User = User;
exports.Question = Question;
