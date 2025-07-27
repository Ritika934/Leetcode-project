const mongoose = require('mongoose')
async function main(){
    console.log("HELLO")
    await mongoose.connect(process.env.CONNECTION_STRING)
}

module.exports = main;
