import mongoose from "mongoose";

export default function connectToDatabase() {
    const uri = process.env.MONGODB_CONNECTION_STRING
    console.log("uri:", uri)
    mongoose
    .connect(uri)
    .then(() => console.log("HealthAid db connection established"))
    .catch((err) => console.log("HealthAid db connection not established"));
}