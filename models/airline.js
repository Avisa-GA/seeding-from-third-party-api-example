'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class airline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  airline.init({
    iata_code: DataTypes.STRING,
    name: DataTypes.STRING,
    icao_code: DataTypes.STRING,
    lowCostCarrier: DataTypes.BOOLEAN,
    website: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'airline',
  });
  return airline;
};