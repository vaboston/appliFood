var express = require('express');
var path = require('path');
var mysql = require('mysql');
var cookieSession = require('cookie-session');
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



var cookieParser = require('cookie-parser');
app.use(cookieParser({secret: 'toto'}))
app.use(cookieSession({
  name: 'session',
  keys: ['TOTOTO'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


// app.use(cookieParser(config.cookieSecret))
// // need cookieParser middleware before we can do anything with cookies
// app.use(express.cookieParser());

// // set a cookie
// app.use(function (req, res, next) {
//   // check if client sent cookie
//   var cookie = req.cookies.cookieName;
//   if (cookie === undefined)
//   {
//     // no: set a new cookie
//     var randomNumber=Math.random().toString();
//     randomNumber=randomNumber.substring(2,randomNumber.length);
//     res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
//     console.log('cookie created successfully');
//   } 
//   else
//   {
//     // yes, cookie was already present 
//     console.log('cookie exists', cookie);
//   } 
//   next(); // <-- important!
// });




// req.signedCookies['name']


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'appliFood' 
});

var JeanClaude = 'MaRecette';

app.get("/",function(req,res){


    // read cookies
    console.log(req.cookies) 

    

    req.session.views = 'Gras'

	tototo = JeanClaude;

	console.log(req.body);
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
			// if (req.session.views) {console.log(res.session.views);}
			console.log(req.session.views)
			CookieGras = req.session.gras;
			CookieSaison = req.session.saison;
			CookieCategorie = req.session.categorie;
			res.render('home', {results: rows, saison: CookieSaison, gras: CookieGras, categorie: CookieCategorie, select: 'selected'});
			if (!err)
				//console.log('The solution is: ', rows);
				console.log('The solution is:');
			else
				console.log('Error while performing Query.');
		});

	});
});

app.post("/", function (req, res) {
console.log("body /", req.body)
queryString = 'SELECT * FROM Recette WHERE Categorie = ' + connection.escape(req.body.Categorie) + ' and Gras = ' + connection.escape(req.body.Gras) + ' order by rand() limit 1'
	connection.query(queryString, function(err, rows, fields) {
		res.render('home', function(err, html){
			var JeanClaude = rows;
			console.log("on set jc")
			console.log(JeanClaude)
			tototo = rows;
		});
	})
})

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

app.post('/getRecette', function (req, res) {
	console.log(req.body)
	console.log('Get recette call')
	number = req.body.recette

// select * from table order by rand() limit 10
	queryString = 'SELECT * FROM Recette WHERE'

	if (req.body.Categorie ) { queryString = queryString + ' Categorie = ' + connection.escape(req.body.Categorie)}
	if (req.body.Saison && req.body.Categorie) {queryString = queryString + 'and  Saison = ' + connection.escape(req.body.Saison)}
	if (req.body.Gras && req.body.Categorie) {queryString = queryString + 'and  Gras = ' + connection.escape(req.body.Gras)}

	if (req.body.Saison && !req.body.Categorie) {queryString = queryString + ' Saison = ' + connection.escape(req.body.Saison)}
	
	if (req.body.Gras && !req.body.Categorie && !req.body.Saison) {queryString = queryString + ' Gras = ' + connection.escape(req.body.Gras)}


	if (!req.body.Categorie && !req.body.Saison && !req.body.Gras) {queryString = 'SELECT * FROM Recette'}
   // queryString = 'SELECT * FROM Recette WHERE Categorie = ' + connection.escape(req.body.Categorie) + ' and Gras = ' + connection.escape(req.body.Gras)+ ' and Saison = ' + connection.escape(req.body.Saison) + ' order by rand() limit 1'
	
	queryString = queryString + ' order by rand() limit 1'
	connection.query(queryString, function(err, rows, fields) {
		let options = {
	        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
	        httpOnly: true, // The cookie only accessible by the web server
	        signed: true // Indicates if the cookie should be signed
	    }

	    // Set cookie
    	req.session.gras = req.body.Gras;
    	// req.session.categorie = req.body.Categorie;
    	req.session.saison = req.body.Saison;
    	req.session.categorie = req.body.Categorie;
    	console.log('gras :  ?', req.session.views);
		// res.render('home', {results: rows, gras: req.session.gras, categorie: req.session.categorie, saison: req.session.saison, select: 'selected'});
		res.render('home', {results: rows, saison: req.session.saison, gras: req.session.gras, categorie: req.session.categorie, select: 'selected'});

			// res.render('home', {results: rows});
			if (!err)
				//console.log('The solution is: ', rows);
				console.log('The solution is:');
			else
				console.log('Error while performing Query.');
		});

});
app.listen(3000);
