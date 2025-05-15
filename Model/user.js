const mongoose=require('mongoose');
const passportmongoose=require('passport-local-mongoose');
const listing=require('../Model/liststing');

let UserSchema=mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    fav:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'listing',
    }],
    resettokens:String,
    resetexpires:Date,
    recentList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'listing'
    }]
})


UserSchema.plugin(passportmongoose);



let user=mongoose.model('user',UserSchema);

module.exports=user;
