module.exports = function (sequelize, DataTypes) {

  var Sequelize = require("sequelize");
  var sequelize = require("../config/connection.js");
  var bcrypt = require("bcryptjs");

  var Designer = sequelize.define("Designer", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    emailAddress: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      },
    },
    phoneNumber: DataTypes.INTEGER,
    password: DataTypes.STRING,
    password2: DataTypes.STRING,
    brandName : DataTypes.STRING,
    bio: DataTypes.TEXT,
  }, {
    freezeTableName: true // Model tableName will be the same as the model
  });

  Designer.prototype.validPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  Designer.prototype.generateHash = function (password) {
    return bcrypt.hash(password, bcrypt.genSaltSync(10));
  };


  // Populate Designer Table with One Row
  // ====================================
  Designer.sync({
    force: true
  }).then(function () {
    // Table created
    return Designer.create({
      firstName: "Anonymous",
      lastName: "Doe",
      username: "Andy",
      emailAddress: "example@gmail.com",
      phoneNumber: 7371111,
      password: "1",
      password2: "1",
      brandName: "Nike",
      bio: "Here is all you need to know about me."
    }).catch(function (err) {
      console.log("\nUnable to populate table with first row.", err);
    });

  });


  // ========================
  // VISTITORS TABLE
  // ========================

  var Visitors = sequelize.define("Visitors", {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      },
    },
    designID: DataTypes.INTEGER
  });

  // return Designer;
  return Designer;
};