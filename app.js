var express = require('express');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser')
var app = express();
var sys = require('sys')
var exec = require('child_process').exec;
var child;
app.set('view engine', 'ejs');
app.use( bodyParser.json() );     
app.use(bodyParser.urlencoded({   
	extended: true
})); 
	

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'appliFood' 
});


app.get("/",function(req,res){
	connection.connect(function(err, callback){
		listeIngredient = [];
		connection.query('SELECT Nom FROM Ingredient', function(err, rows, fields) {
			listeIngredient = rows;
			//console.log("liste : ", liste);
		});
		listeSaison = [];
		connection.query('SELECT Nom FROM Saison', function(err, rows, fields) {
			listeSaison = rows;
			//console.log("liste : ", liste);
		});
		listeGras = [];
		connection.query('SELECT Nom FROM Gras', function(err, rows, fields) {
			listeGras = rows;
			//console.log("liste : ", liste);
		});
		listeCategorie = [];
		connection.query('SELECT Nom FROM Categorie', function(err, rows, fields) {
			listeCategorie = rows;
			//console.log("liste : ", liste);
		});
		connection.query('SELECT * FROM Recette', function(err, rows, fields) {
			res.render('home', {results: rows});
			if (!err)
				//console.log('The solution is: ', rows);
				console.log('The solution is:');
			else
				console.log('Error while performing Query.');
		});

	});
});

app.post('/addRecette', function (req, res) {
	console.log("body", req.body)
	connection.connect(function(err, callback){
		connection.query('INSERT INTO Recette SET ?', req.body, 
			function (err, result) {
				console.log(err)
				console.log()
				// console.log(result.insertId);
			});
		connection.query('SELECT * FROM recette', function(err, rows, fields) {
			res.redirect('/')
			if (!err)
				//console.log('The solution is: ', rows);
				console.log('The solution is: ');
			else
				console.log('Error while performing Query.');
		});
	});
});
app.post('/addIngredient', function (req, res) {
	console.log("body", req.body)
	connection.connect(function(err, callback){
		connection.query('INSERT INTO Ingredient SET ?', req.body, 
			function (err, result) {
				console.log(err)
				// console.log(result.insertId);
			});
		connection.query('SELECT * FROM recette', function(err, rows, fields) {
			res.redirect('/')
			if (!err)
				//console.log('The solution is: ', rows);
				console.log('The solution is: ');
			else
				console.log('Error while performing Query.');
		});
	});
});
app.post('/dellIngredient', function (req, res) {
	console.log("body", req.body)
	connection.connect(function(err, callback){
		connection.query('DELETE FROM Ingredient WHERE Nom = ?', req.body.nom, 
			function (err, result) {
				if (err)
					console.log("no", err)
				else
					console.log("ok", result)
				// console.log(result.insertId);
			});
		connection.query('SELECT * FROM recette', function(err, rows, fields) {
			res.redirect('/')
			if (!err)
				//console.log('The solution is: ', rows);
				console.log('The solution is: ');
			else
				console.log('Error while performing Query.');
		});
	});
});
// app.post('/shell', function (req, res) {
// 	child = exec("", function (error, stdout, stderr) {
// 		sys.print('stdout: ' + stdout);
// 		sys.print('stderr: ' + stderr);
// 		if (error !== null) {
// 			console.log('exec error: ' + error);
// 		}
// 	});

// });

app.post('/delRecette', function (req, res) {
	console.log(req.body.number)
	number = req.body.recette
	connection.connect(function(err, callback){
				connection.query('DELETE FROM Recette WHERE Nom = ?', req.body.nom, 
					function (err, result) {
						console.log(err)
						connection.query('SELECT * FROM recette', function(err, rows, fields) {
							res.redirect('/')
							if (!err)
								console.log('The solution is: ', rows);
							else
								console.log('Error while performing Query.');
						});

					});
			});	
});
app.listen(3000);
