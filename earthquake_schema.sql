CREATE TABLE Continent (
    continent_id INT AUTO_INCREMENT PRIMARY KEY,
    continent_name VARCHAR(255)
);

CREATE TABLE Country (
	country_id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(255),
    continent_id INT,
    FOREIGN KEY (continent_id) REFERENCES Continent(continent_id)
);

CREATE TABLE City (
	city_id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255),
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES Country(country_id)
);

CREATE TABLE Location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    city_id INT,
    FOREIGN KEY (city_id) REFERENCES City(city_id)
);

CREATE TABLE MagnitudeType (
    magType_id INT AUTO_INCREMENT PRIMARY KEY,
    magType VARCHAR(255)
);

CREATE TABLE Network (
    net_id INT AUTO_INCREMENT PRIMARY KEY,
    net VARCHAR(255)
);

CREATE TABLE EarthquakeDetails (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    distance_from_location INT,
    direction_from_location VARCHAR(255),
    time_hour VARCHAR(255),
    magnitude DECIMAL(2,1),
    year INT,
    month INT,
    day INT,
    cdi INT,
    mmi INT,
    alert VARCHAR(255),
    tsunami INT,
    sig INT,
    nst INT,
    dmin DECIMAL(10,6),
    gap INT,
    depth DECIMAL(10,6),
    location_id INT,
    magType_id INT,
    net_id INT,
    FOREIGN KEY (location_id) REFERENCES Location(location_id),
    FOREIGN KEY (magType_id) REFERENCES MagnitudeType(magType_id),
    FOREIGN KEY (net_id) REFERENCES Network(net_id)
);
