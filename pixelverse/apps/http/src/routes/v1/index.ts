import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";

export const router= Router();

router.post("/signup", (req, res)=>{
   res.json({
    message: "Signup successful"
   })
})

router.get("/signin", (req, res)=>{
    res.json({
        message: "Signin successful"
    });
})

router.get("/elements", (req, res)=>{
    res.json({
        message: "Elements retrieved successfully"
    });
})

router.get("/avatars",(req,res)=>{
    res.json({
        
    })
})
router.use("/user",userRouter);
router.use("/space",spaceRouter);
router.use("/admin",adminRouter);