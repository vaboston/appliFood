#!/usr/bin/python
# GET random recipe : curl  -X GET http://localhost:5000/randomrecette
# POST add recipe curl -d '{"ingredient":"fromage,pain,bacon"}' -H "Content-Type: application/json" -X POST http://localhost:5000/recette/raclette


import random
import redis
from flask import Flask
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
api = Api(app)



r = redis.Redis(
    host='localhost',
    port=6379)

class RandomRecette(Resource):
    def get(self):
        size = r.llen('recette')
	rand = random.randint(0,size-1)
	print(rand)
	print(size)
        recette = r.lrange('recette', rand, rand)
	print(recette)
	recette_ingredient = r.lrange(recette[0], 0,0)
	answer = [{"name": recette[0], "ingredients": recette_ingredient}]
        return answer, 200
class Recette(Resource):
    def post(self, name):
        parser = reqparse.RequestParser()
        parser.add_argument("ingredient")
        args = parser.parse_args()
	print(name)
	print(args)
        r.lpush('recette',name)
        r.lpush(name,args.ingredient)

    def get(self, name):
        rec = r.lrange(name, 0, -1)
        return rec, 200
       
api.add_resource(Recette, "/recette/<string:name>")
api.add_resource(RandomRecette, "/randomrecette")




app.run(debug=True)
