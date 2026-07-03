"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("claimed_rewards", {
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

      rewardId: {
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

    await queryInterface.addIndex("claimed_rewards", ["playerId", "rewardId"], {
      unique: true,
      name: "claimed_rewards_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("claimed_rewards");
  },
};
