# Earthquake App
The Earthquake App allows users to explore earthquake data in the context of a map interface. This app is built using Flask and uses a MySQL database hosted on AWS using the Amazon Relational Database Service (RDS). This app supports both visualization of the locations of earthquakes and offers modes to interact with the data and send queries to the database. ***More details of the project are stored in the wiki***.

## Key Features
*   Interactive Map: Visualize the earthquake data points based on the locations of earthquakes. Get earthquake details by clicking on the marker.
*   Pass Queries: Filter earthquake data based on continent, month, and year attributes.
*   App uses database which is stored in RDS, which avoids the need to store the database locally

## Setup/Installation Requirements
1.   Clone the repository
2.   Set up a Virtual Environment
  - Install the virtual environment package using `pip install virtualenv`
  - Create the virtual environment using `virtualenv env`
3. Activate the virtual environment using `source env/bin/activate`
4. Install the requirements using `pip install -r requirements.txt`
5. Run the app using `python earthquake_app.py`
6. Navigate to `http://localhost:5000/`

# Earthquake App can be accessed [here](http://54.227.112.195:5000/)
This was set up using an Amazon EC2 instance to create a web server.

## [Earthquake App Live Demo can be accessed here] (https://drive.google.com/file/d/1nQL6edRt-BAb-yI5MFgMUVTExt1xQISe/view?usp=drive_link)