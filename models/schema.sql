DROP DATABASE IF EXISTS wearItWell;
CREATE DATABASE wearItWell;

USE wearItWell;

CREATE TABLE desinger (
id INT AUTO_INCREMENT NOT NULL, 
name VARCHAR(255) NOT NULL, 
password VARCHAR(255) NOT NULL, 
email VARCHAR (255) NOT NULL,
phoneNumber INT (10) NOT NULL,
brandName VARCHAR(255) NOT NULL, 
bio TEXT NOT NULL,
PRIMARY KEY (id)
); 


CREATE TABLE designs (
id INT  AUTO_INCREMENT NOT NULL, 
imageName VARCHAR(255),--USE WITH MULTER
designTitle VARCHAR(255),
description TEXT,
design LONGBLOB NOT NULL,
desingerID INT,
numberLikes INT,
PRIMARY KEY (id)

);


CREATE TABLE visitors (
id INT  AUTO_INCREMENT NOT NULL, 
email VARCHAR (255) NOT NULL,
designID INT (10) NOT NULL, --foreign key of design
PRIMARY KEY (id)

);

