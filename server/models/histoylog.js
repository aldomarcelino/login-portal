"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HistoyLog extends Model {
    static associate(models) {
      HistoyLog.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  HistoyLog.init(
    {
      userId: DataTypes.UUID,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HistoyLog",
    }
  );
  return HistoyLog;
};
