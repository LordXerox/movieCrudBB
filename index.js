const express = require("express");
const app = express();

app.use(express.static(__dirname + '/client'))

// Start MongoDB Atlas
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const mongooseUri = "mongodb+srv://LordXerox:uUfvvJ77ZwHw4mKi@cluster0.ofvwa1e.mongodb.net/movieDatabase"
mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})
const movieSchema = {
	title: String,
	comments: String
}
const Movie = mongoose.model("movie", movieSchema);

// Create route called from create.html
app.post("/create", function(req, res){
	let newNote = new Movie({
		title: req.body.title,
		comments: req.body.comments
	})
	
	newNote.save();
	res.redirect("/");
})

const renderNotes = (notesArray) => {
	let text = "Movies Collection:\n\n";
	notesArray.forEach((note)=>{
		text += "Title: " + note.title  + "\n";
		text += "Comments: " + note.comments  + "\n";
		text += "ID:" + note._id + "\n\n";
	})
	text += "Total Count: " + notesArray.length;
	return text
}

app.get("/read", function(request, response) {
	Movie.find({}).then(notes => { 
		response.type('text/plain');
		response.send(renderNotes(notes));
	})
})

//route to update.html
	//checks note.title for all
	//if note.title == req.body.title, overwrite title and comments of note
app.post("/update", async (req, res) => {
				
	await Movie.updateOne({title: String(req.body.old)}, {$set:{title: req.body.title, comments: req.body.comments}})
		
	res.redirect("/");
})
		
		


//search.html - return movies that match title
app.post("/search", function(req, res){
	Movie.find({title: String(req.body.title)}).then(notes => { 
		res.type('text/plain');
		res.send(renderNotes(notes));
		})
})

//delete.html - delete movie
app.post("/delete", async (req, res) => {
	await Movie.deleteOne({title: String(req.body.title)})


	res.redirect("/");
})







//Test Port Connection
const port = process.env.PORT || 3000
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})
