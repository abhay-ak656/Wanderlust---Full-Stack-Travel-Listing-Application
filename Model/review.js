const mongoose=require('mongoose');
const user=require('../Model/user');
const reviewSchema=new mongoose.Schema({
   rating:Number,
   comment:String,
   created_At:{
    type:Date,
    default:Date.now
   },
   author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
   }
})

const review=mongoose.model('review',reviewSchema);


module.exports=review;