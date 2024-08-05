const {Schema, model}=require('mongoose')

const userSchema= new Schema(
    {
        fullName:{
            type:String,
            required:true
        },
        email:{
            unique:true,
            type:String
        },
        salt:{
            type:String,
        }, 
        password:{
            type:String,
            required:true

        },

        profileImgURL:{
            type:String,
            default:"/images/default.png"
        },


},

{timestamps:true})

const User=model('user',userSchema)



module.exports={
    User 
}