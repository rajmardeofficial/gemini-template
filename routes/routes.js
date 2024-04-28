const express=require("express")
const router=express.Router()

router.post("/signin",(req,res)=>{
    res.send("signin")
})

router.post("/signup",(req,res)=>{
    res.send("signup")
})

router.post("/skills",(req,res)=>{
    res.send("skills")
})

router.post("/other",(req,res)=>{
    res.send("other")
})
module.exports=router