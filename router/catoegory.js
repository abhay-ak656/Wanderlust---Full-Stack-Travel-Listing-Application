const express=require('express');
const listing=require('../Model/liststing');
const expressError = require('../expreeserror/expresserror');
const { isLoggedIn } = require('../Middleware/middleware');
const User=require('../Model/user');

const router=express.Router();


router.get('/:category',async (req,res)=>{
    let {category}=req.params;
   let list;
   if(category==='New'){

      if(!req.user){
         req.flash('error',"you must login first to see the list");
         return res.redirect('/listing/user/login');
      }
      let user=await User.findById(req.user.id).populate('recentList');
         list=user.recentList;
   }else{
     list=await listing.find({category:category});
   }
    if(list.length==0){
        console.log('error');
        throw new expressError(404,`Not found this ${category} list`);
    }
     let userfav=req.user?req.user.fav:[];
    res.render('listing/index.ejs',{ list,userfav });
})

module.exports=router;