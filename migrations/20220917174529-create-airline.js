'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('airlines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      iata_code: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      icao_code: {
        type: Sequelize.STRING
      },
      lowCostCarrier: {
        type: Sequelize.BOOLEAN
      },
      website: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('airlines');
  }
};