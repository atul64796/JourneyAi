import connectDb from "./src/db/index.js";
import app from "./src/app.js";
import dotenv from "dotenv";


dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 7000;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
});
