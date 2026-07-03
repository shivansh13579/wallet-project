"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ledger", {
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

      delta: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },

      reason: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },

      idempotencyKey: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("ledger", ["playerId"], {
      name: "ledger_player_idx",
    });

    await queryInterface.addIndex("ledger", ["idempotencyKey"], {
      name: "ledger_idempotency_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ledger");
  },
};
