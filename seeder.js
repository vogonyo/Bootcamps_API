const fs =require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({
    path: './config/config.env'
});

//load models
const Bootcamp = require('./models/Bootcamp');

//Load DBs
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

//Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`));

//Import JSON into DB
const importData = async() => {
    try{
        await Bootcamp.create(bootcamps);
        console.log('Data Imported....'.green.inverse);
        process.exit();
    }catch(err){
        console.log(err);
    }
}


const deleteData = async() => {
    try{
        await Bootcamp.deleteMany();
        console.log('Data Destroyed ...'.red.inverse);
        process.exit();
    }catch(err){
        console.log(err);
    }
}

if(process.argv[2] === '-i'){
  importData();
}else 
if(process.argv[2] === '-d'){
 deleteData();
}