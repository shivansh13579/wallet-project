"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("idempotency_keys", {
      key: {
        type: Sequelize.STRING(128),
        allowNull: false,
        primaryKey: true,
      },

      endpoint: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },

      requestHash: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },

      statusCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      responseBody: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("idempotency_keys");
  },
};
