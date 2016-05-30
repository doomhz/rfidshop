AppHelper = require "../lib/app_helper"

module.exports = (sequelize, DataTypes) ->

  Payment = sequelize.define "Payment",
      full_name:
        type: DataTypes.STRING
        allowNull: true
        validate:
          len: [2, 250]
      card_number:
        type: DataTypes.STRING
        allowNull: true
        validate:
          len: [2, 250]
      total:
        type: DataTypes.BIGINT
        defaultValue: 0
        allowNull: false
        get: ()->
          AppHelper.fromBigint @getDataValue("total")
        set: (total)->
          @setDataValue "total", AppHelper.toBigint total
      status:
        type: DataTypes.INTEGER.UNSIGNED
        allowNull: false
        defaultValue: AppHelper.getPaymentStatusInt "pending"
        get: ()->
          AppHelper.getPaymentStatusLiteral @getDataValue("status")
        set: (status)->
          @setDataValue "status", AppHelper.getPaymentStatusInt(status)
    ,
      tableName: "payments"

  Payment