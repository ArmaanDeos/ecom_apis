const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()



// ? REGISTER 
router.post("/register", async (req,res) =>{

    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error)
    }

});


// ? LOGIN
router.post("/login",async (req,res)=>{

    try {
        
        const user = await User.findOne({
            username:req.body.username,
        });

        // Check Condition user
        !user && res.status(401).json("Wrong Credentials!")

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        // Check Condition for password is same or not
        OriginalPassword !== req.body.password && res.status(401).json("Wrong Credentials!");

        // ! JWT Authentication
        const accessToken = JWT.sign({

            id:user._id,
            isAdmin:user.isAdmin

        },process.env.JWT_SEC,
        {expiresIn:"3d"}
        )

        // remove password from db
        const {password, ...others} = user._doc;

        // if all ok then return
        res.status(200).json({...others, accessToken})

    } catch (error) {
        res.status(500).json(error)
        
    }

})


module.exports = router;