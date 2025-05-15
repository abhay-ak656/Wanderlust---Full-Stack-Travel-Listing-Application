const mongoose=require('mongoose');
const review=require('./review.js');
const User=require('../Model/user.js');

let listSchema=mongoose.Schema({
    title:{
       type: String,
       required:true
    },

    description:{
        type:String,
        required:true
    },
    image:{
      url:String,
      filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'review'
    }],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    },
    geometry:{
      type:{
        type:String,
        enum:['Point']
      },
      coordinates:{
        type:[Number],
        required:true
      }
    },
    category:String
})

listSchema.post('findOneAndDelete', async (listing)=>{

  if(listing){
  await review.deleteMany({_id:{$in:listing.reviews}})
  }

  await User.findByIdAndUpdate(listing.owner,{$pull:{fav:listing._id}});
 let user=  await User.findByIdAndUpdate(listing.owner,{$pull:{recentList:listing._id}},{new:true});

 console.log(user);

})

const listing=mongoose.model('listing',listSchema);
module.exports=listing;

