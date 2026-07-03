"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventory", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      playerId: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },

      item_id: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("inventory", ["playerId", "item_id"], {
      unique: true,
      name: "inventory_player_item_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inventory");
  },
};
