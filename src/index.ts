import dotenv from "dotenv";
import { connectToMongoDB } from "./database/mongo";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;


const startServer = async () => {
    try {
        await connectToMongoDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();