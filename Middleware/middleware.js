const listing=require('../Model/liststing')
const joi=require('joi');
const review=require('../Model/review')
const expressError = require('../expreeserror/expresserror.js');
const {reviewSchema}=require('../schema.js');
const {listingschema}=require('../schema.js');

const isLoggedIn=(req,res,next)=>{
    console.log(req);
    if(!req.isAuthenticated()){
        let {id,reviewid}=req.params;
        if(reviewid && req.query._method==='delete'){
            req.session.redirectUrl=`/listing/${id}`;
        }else{
        req.session.redirectUrl=req.originalUrl;
        }
        req.flash('error','you must login for making the task');
        return res.redirect('/listing/user/login');
    }
    next();
}

const saveredirecrUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

const isowner=async(req,res,next)=>{
    let { id } = req.params;
    let list=await listing.findById(id);
    if(!req.user._id.equals(list.owner)){
        req.flash('error',"Sorry! you are not the owner of the listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
const validatelisting=(req,res,next)=>{
    console.log(req.body);
    const {error}=listingschema.validate(req.body);
    if(error){
        const message=error.details.map((el)=>el.message).join(',');
        console.log(message);
        throw new expressError(400,message);
    }else {
        next();
    }
}
const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const message=error.details.map((el)=>el.message).join(',');
        throw new expressError(400,message);
    }else {
        next();
    }
}

const isreviewOwner=async(req,res,next)=>{
    console.log("enter");
    let { id ,reviewid} = req.params;
    let item=await review.findById(reviewid);
    if(req.user &&!req.user._id.equals(item.author)){
        req.flash('error',"You Don't have a permission to delete");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
module.exports={
    isLoggedIn,
    saveredirecrUrl,
    isowner,
    validatelisting,
    validateReview,
    isreviewOwner
}