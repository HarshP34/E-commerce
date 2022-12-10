const Sequelize=require('sequelize');

const sequelize=new Sequelize('node-complete', 'root','Harsh1005',{dialect:'mysql',host:'localhost'})

module.exports=sequelize;