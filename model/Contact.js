const mongoose=require("mongoose")
const Contact=mongoose.model("contact",{
    nama:{
        type:String,
        require:true
    },
    nohp:{
        type:String,
        require:true
    },
    email:
        {
            type:String
        }
    
})
module.exports=Contact