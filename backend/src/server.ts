import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"

app.listen(5000,()=>{
     console.log("War just Started ");
})
