const mongoose = require("mongoose")
const connectToDb = async () => {
    mongoose.connect("mongodb+srv://amadullah67:hnwpvgSvlzqmTHaq@cluster0.kacqlw9.mongodb.net/").then(() => {
        console.log("Connection to database is established.")
    }).catch((error)=> {
        console.log(error)
    })
}

module.exports = connectToDb;
