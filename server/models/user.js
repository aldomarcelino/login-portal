"use strict";
const { Model } = require("sequelize");
const { hashThePassword } = require("../helpers/encryption");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email can't null",
          },
          notEmpty: { msg: "Email is required" },
          isEmail: {
            msg: "Please check your format email",
          },
        },
        unique: {
          msg: "Email already exist",
        },
      },
      full_name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: "Full name can't null",
          },
          notEmpty: { msg: "Full name is required" },
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: "Password can't null",
          },
          notEmpty: { msg: "Password is required" },
          len: {
            args: 8,
            msg: "Minimum password is 8 characters",
          },
        },
      },
      sso_sign_option: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      google_sso_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      facebook_sso_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      phone_number: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: {
          msg: "Phone number already exist",
        },
      },
      login_count: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      is_login: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      is_verified: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user) => {
    user.password = hashThePassword(user.password);
  });
  return User;
};
