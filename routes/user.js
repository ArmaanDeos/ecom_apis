const User = require("../Models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js")

const router = require("express").Router();


// ? UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    // to update user first decrypt the password
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

   try {
     // find the user and update it
     const updatedUser = await User.findByIdAndUpdate(req.params.id,
        {
        $set:req.body
    },
    {
        new:true
    }
    );
    res.status(200).json(updatedUser)
   } catch (error) {
    res.status(500).json(error)
   }

});



// ? DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted successfully!")
    } catch (error) {
        res.status(500).json(error)
        
    }

})


// ? GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{

    try {
      const user =  await User.findById(req.params.id);
      const {password, ...others}= user._doc;
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
        
    }

});


// ? GET ALL USER

router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    // # get the limited users
    const query = req.query.new
    try{
        const users = query ? await User.find().sort({_id:-1}).limit(2) : await User.find()
        res.status(200).json(users)
    }catch(err){
        res.status(500).json(err)
    }
})

// ? GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req,res)=>{

    const date = new Date();
    // get today last year date
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
    // console.log(lastYear)

    try {
        
        const data = await User.aggregate([
            {$match:{ createdAt : {$gt:lastYear}} },
            {
                $project:{
                month:{$month:"$createdAt"}
            },
        },
        {
            $group:{
                _id:"$month",
                total:{$sum: 1}
            }
        }
        ]);
        res.status(200).json(data)

    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;