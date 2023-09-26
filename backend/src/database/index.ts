import mongoose from "mongoose";

/**
   * Connects to our MongoDB database
   */
export default function connectToDatabase() {
    const uri = process.env.MONGODB_CONNECTION_STRING
    mongoose
    .connect(uri)
    .then(() => console.log("HealthAid db connection established"))
    .catch((err) => console.log("HealthAid db connection not established"));
}