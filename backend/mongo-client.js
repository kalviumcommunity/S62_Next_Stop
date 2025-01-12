if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config();
  };


const mongoclient = require('mongodb').MongoClient;

const connection = new mongoclient(process.env.DB_URL);


async function getDB(){
    const db = connection.db('ASAP');
    return db.collection('users');
}
module.exports = getDB;