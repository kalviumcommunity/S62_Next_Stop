if(process.env.NODE_ENV !== 'PRODUCTION'){
  require('dotenv').config();
}


const mongoose=require('mongoose')

const connectDataBase = () => {
 
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
        console.log('Database is connected Successfully');
      })
      .catch((er) => console.log('Database connection Failed...', er.message));
  };
 
  module.exports = connectDataBase;