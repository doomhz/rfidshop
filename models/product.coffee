AppHelper = require "../lib/app_helper"

module.exports = (sequelize, DataTypes) ->

  Product = sequelize.define "Product",
      name:
        type: DataTypes.STRING
        allowNull: false
        validate:
          len: [2, 250]
      code:
        type: DataTypes.STRING
        allowNull: false
        unique: true
        validate:
          len: [1, 100]
      price:
        type: DataTypes.BIGINT
        defaultValue: 0
        allowNull: false
        get: ()->
          AppHelper.fromBigint @getDataValue("price")
        set: (price)->
          @setDataValue "price", AppHelper.toBigint price
      status:
        type: DataTypes.INTEGER.UNSIGNED
        allowNull: false
        defaultValue: AppHelper.getProductStatusInt "available"
        get: ()->
          AppHelper.getProductStatusLiteral @getDataValue("status")
        set: (status)->
          @setDataValue "status", AppHelper.getProductStatusInt(status)
    ,
      tableName: "products"

  Product