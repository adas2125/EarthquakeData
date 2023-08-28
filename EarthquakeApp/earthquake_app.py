from flask import Flask, render_template, request
from flask_mysqldb import MySQL
from geopy import distance
from flask import jsonify

app = Flask(__name__)
# connecting to the database stored in RDS
app.config['MYSQL_HOST'] = 'earthquakes-rds.c3u6maueatrz.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'Amitdas23'
app.config['MYSQL_DB'] = 'trial'

mysql = MySQL(app)

# home page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/coords', methods=['POST'])
def coords():
    # handling the POST request from the client
    if request.method == 'POST':
        latitude = request.json['latlng']['lat']
        longitude = request.json['latlng']['lng']
        slider_value = request.json['sliderValue']

        # querying the database for all earthquakes
        cursor = mysql.connection.cursor()
        cursor.execute('''
            SELECT event_id, ed.magnitude, city_name, country_name, latitude, longitude, tsunami
            FROM EarthquakeDetails as ed
            JOIN Location as l ON ed.location_id = l.location_id
            JOIN City as c ON l.city_id = c.city_id
            JOIN Country as co ON c.country_id = co.country_id;
        ''')
        
        # storing all earthquakes within the `slider value` miles of the user's location
        close_earthquakes = []
        results = cursor.fetchall()
        
        for row in results:
            if distance.distance((latitude, longitude), (row[4], row[5])).miles <= float(slider_value):
                close_earthquakes.append(row)

        return close_earthquakes

@app.route('/query', methods=['POST'])
def query():
    # handling the POST request from the client
    if request.method == 'POST':
        continent = request.json['continent']
        month = request.json['month']
        year = request.json['year']

        cursor = mysql.connection.cursor()
        # querying the database based on the user's query
        if year == 'All Years' or year == '':
            if month == 'All Months':
                cursor.execute('''
                    SELECT event_id, magnitude, city_name, country_name, latitude, longitude, tsunami
                    FROM EarthquakeDetails as ed
                    JOIN Location as l ON ed.location_id = l.location_id
                    JOIN City as c ON l.city_id = c.city_id
                    JOIN Country as co ON c.country_id = co.country_id
                    JOIN Continent as con ON co.continent_id = con.continent_id
                    WHERE con.continent_name = %s;
                ''', (continent,))
            else:
                cursor.execute('''
                    SELECT event_id, magnitude, city_name, country_name, latitude, longitude, tsunami
                    FROM EarthquakeDetails as ed
                    JOIN Location as l ON ed.location_id = l.location_id
                    JOIN City as c ON l.city_id = c.city_id
                    JOIN Country as co ON c.country_id = co.country_id
                    JOIN Continent as con ON co.continent_id = con.continent_id
                    WHERE con.continent_name = %s AND month = %s;
                ''', (continent, month))
        else:
            if month == 'All Months':
                cursor.execute('''
                    SELECT event_id, magnitude, city_name, country_name, latitude, longitude, tsunami
                    FROM EarthquakeDetails as ed
                    JOIN Location as l ON ed.location_id = l.location_id
                    JOIN City as c ON l.city_id = c.city_id
                    JOIN Country as co ON c.country_id = co.country_id
                    JOIN Continent as con ON co.continent_id = con.continent_id
                    WHERE con.continent_name = %s AND year = %s;
                ''', (continent, year))
            else:
                cursor.execute('''
                    SELECT event_id, magnitude, city_name, country_name, latitude, longitude, tsunami
                    FROM EarthquakeDetails as ed
                    JOIN Location as l ON ed.location_id = l.location_id
                    JOIN City as c ON l.city_id = c.city_id
                    JOIN Country as co ON c.country_id = co.country_id
                    JOIN Continent as con ON co.continent_id = con.continent_id
                    WHERE con.continent_name = %s AND month = %s AND year = %s;
                ''', (continent, month, year))
        
        results = cursor.fetchall()
        return jsonify(results)

if __name__ == '__main__':
    app.run(debug=False)