import mongoose from "mongoose";

const userschema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
        },
        email: {
            type: "string",
            required: true,
        },
        password: {
            type: "string",
            required: true,
        },
        verificationCode:{
            type:"string",
            default:null,
            expires:60*10,
        },
        logins:[{
            Website:{
                type:"string",
                required:true,
            },
            username:{
                type:"string",
                required:true,
            },
            password:{
                type:"string",
                required:true,
            },
            trash:{
                type:Boolean,
                default:false,
            },
            trashAt:{
                type:Date,
                default:null,   
            },
        }],
        isverified:{
            type:Boolean,
            default:false,
        },
    }
);

const User = mongoose.model("User", userschema);
export default User;