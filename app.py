from flask import Flask, Response, render_template
import json

from dao import BeerDAO

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', name='Simple PunkAPI client')

@app.route('/search/<string:beer_name>', defaults={'page': 1})
@app.route('/search/<string:beer_name>/<int:page>')
def search(beer_name, page):
    bd = BeerDAO()
    with bd:
        data = bd.get_beers(beer_name, page)
        return Response(json.dumps(data), mimetype='application/json')

@app.route('/details/<int:id>')
def details(id):
    bd = BeerDAO()
    with bd:
        data = bd.get_beer(id)
        return Response(json.dumps(data), mimetype='application/json')