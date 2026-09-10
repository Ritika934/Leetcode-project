const mongoose = require('mongoose')
async function main(){
    await mongoose.connect(process.env.CONNECTION_STRING)
}

module.exports = main;
