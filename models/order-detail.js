const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const OrderDetail=sequelize.define('orderDetail',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  quantity:Sequelize.INTEGER
})

module.exports=OrderDetail;