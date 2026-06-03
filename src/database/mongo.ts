import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient;
let dB: Db;
const dbName = "Memoria_Practicas";

export const connectToMongoDB = async () => {
    try{
        const mongoUrl = process.env.MONGO_URL;
        client = new MongoClient(mongoUrl!);
        await client.connect();
        dB = client.db(dbName);
        console.log("Estás conectado a la base de datos.");
    }
    catch(err){
        console.log("Error de mongo: ", err)
    }
};

export const getDB = ():Db => dB;


export const closeMongoDB = async () => {
    try{
        client && await client.close();
    } catch(err){
        console.log("Error cerrando mongo: ", err)
    }
}