const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");

const app=express();
dotenv.config();

const port=process.env.PORT||15000

const userName=process.env.MONGODB_USERNAME;
const pass=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://damathiaabhi301:${pass}@cluster0.8v8l3zc.mongodb.net/registrationFormDb`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const registrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const Registration=mongoose.model("Registration",registrationSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");

});

app.post("/register",async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        
        const existingUser=await Registration.findOne({email});
        if(!existingUser)
        {
            const RegistrationData=new Registration({
                name,
                email,
                password
            });
            await RegistrationData.save(); 
            res.redirect("/success"); 
        }
        else{
            res.redirect("/error2");
        }

        
    }
    catch(error)
    {  
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.get("/error2",(req,res)=>{
    res.sendFile(__dirname+"/pages/duplicateErr.html");
})
 
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
