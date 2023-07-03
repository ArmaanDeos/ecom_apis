const JWT = require("jsonwebtoken");


//! Verify Token

const verifyToken = (req,res,next)=>{

    // token in headers
    const authHeaders = req.headers.token;

    // Check condition for headers
    if(authHeaders){

        const token = authHeaders.split(" ")[1];

        JWT.verify(token, process.env.JWT_SEC, (err,user)=>{
            if(err){
                res.status(403).json("Token is not Valid!")
            }
            req.user = user;
            next();
        })

    }else{
        return res.status(403).json("You are not Authenticated!")
    }

};


//! Verify token and authorization

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
       if(req.user.id === req.params.id || req.user.isAdmin){
        next();
       }else{
        return res.status(403).json("You are not allowed to do this!")
       }
    })
}


// ! Verify Token and Check isAdmin

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
       if( req.user.isAdmin){
        next();
       }else{
        return res.status(403).json("You are not allowed to do this!")
       }
    })
}



module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}