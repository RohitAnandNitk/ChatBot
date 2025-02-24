import mongoose from 'mongoose';

// configure the dotenv file
import dotenv from 'dotenv';
dotenv.config();

console.log("you db url is : " , process.env.MONGODB_URL);

//const mongoURL = process.env.MONGODB_URL_LOCAL;
const mongoURL = process.env.MONGODB_URL;



//setup mongodb connection
mongoose.connect(mongoURL , { // required parammeters
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

// Get the default connection 
// Mongooes maintain a default connection object repersenting the MongoDB connection
const db  = mongoose.connection;


// define event listener for databases connection 
db.on('connected' , () =>{
    console.log('connected to MongoDB server');
});
db.on('error' , (err) =>{
    console.log('MongoDB connection error ', err);
});

db.on('disconnected' , () =>{
    console.log('MongoDB disconnected');
});


//Export the database connection
export default db;