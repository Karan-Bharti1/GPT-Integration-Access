const express=require('express')
const app=express()
const PORT=3000
const cors=require("cors")
app.use(express.json())
const corsOptions={
    origin:"*",
    credentials:true,
    optionsSuccessStatus:200
}
app.use(cors(corsOptions))

app.get("/",async(req,res)=>{
    res.status(200).json("Routes are working fine")
})


app.listen(PORT,()=>{
    console.log("App is connected on the PORT:"+PORT)
})