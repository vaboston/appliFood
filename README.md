# appliFood

Simple recipe appli, with random result.

-----------------------------------------------

Add recipe ? Easy : 
curl -d '{"ingredient":"fromage,pain,bacon"}' -H "Content-Type: application/json" -X POST http://localhost:5000/recette/raclette


Get random recipe ? Easy too : 
curl  -X GET http://localhost:5000/randomrecette
