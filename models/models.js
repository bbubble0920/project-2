module.exports = function (sequelize, DataTypes) {

  var Sequelize = require("sequelize");
  var sequelize = require("../config/connection.js");
  // var bcrypt = require("bcryptjs");

  var Designer = sequelize.define("Designer", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    password2: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      },
    },
    phoneNumber: DataTypes.INTEGER,
    brandName: DataTypes.STRING,
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
      password: "1",
      password2: "1",
      email: "example@gmail.com",
      phoneNumber: 7371111,
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