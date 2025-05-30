import mongoose from "mongoose";

//mongodb//<user>:<password>@<host>:<port>/<database>?authSource=admin
//mongodb//@<localhost>:<port>/<database>?authSource=admin

const mongoUri ="mongodb://localhost:27017/project?authSource=admin";
const connectDB = async():Promise<void> =>{
    try {
        await mongoose.connect(mongoUri);
        console.log("Succesfully connection with mongo")
    } catch (error) {
        console.log("Cannot connect with mongo: ", error)
        
    }
}

export default connectDB;