var models = require("./models")

var seedAlways = false;

var titles = [
	"Inleiding wat is filosofie?", 
	"De geschiedenis van de filosofie: filosofie of filosofieen"
	];
var questions = [
		[
			"Waarom zeggen we dat woorden de vrijheid van het denken beperken?",
			"Wat zegt Hegel over “het ware”?",
			"Som de verschillende tijdperken op van de geschiedenis van de westerse wijsbegeerte, duid begin- en einddatum aan van elke periode en geef tenminste drie filosofen per tijdperk (BV: voor de Postmoderniteit: Foucault, Deleuze en Agamben)",
			"Kies vijf filosofische disciplines die volgens u belangrijk zijn voor onze tegenwoordige tijd. Leg kort de reden van uw keuze uit.",
			"Kies de grote stromingen waarmee u zich geïdentificeerd ziet. Leg kort uit waarom.",
			"Wat zegt de Franse filosoof G. Deleuze over de filosofie?",
			"Wat toont ons de etymologie van de woorden “filosofie” en “wijsbegeerte” over het filosoferen?"
		],
		[]
	];

var seedLessons = function () {
	if (seedAlways) {
		models.Lesson.remove({}).exec();
		models.Question.remove({}).exec();
	}
	models.Lesson.find({}, function(err, lessons) {
		if (lessons.length === 0) {
			for (var i = 0; i < titles.length; i++) { 
				var lesson = new models.Lesson({
					id : i+1,
					title : titles[i]
				});
				lessonQuestions = questions[i];
				for (var t = 0; t < lessonQuestions.length; t++) {
					var q = new models.Question();
					q.text = lessonQuestions[t];
					lesson.questions.push(q);
					q.save(function(err) {
						if(err) { throw err; }
					});
				}
				lesson.save(function(err) {
					if(err) { throw err; }
			    });
			}
			console.log("Database seeded.");
		}
	});
}

exports.seedLessons = seedLessons;
