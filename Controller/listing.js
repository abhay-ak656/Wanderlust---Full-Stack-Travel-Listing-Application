const listing = require('../Model/liststing.js');
const expressError = require('../expreeserror/expresserror.js');
const mbxgeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const map_token=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: map_token });
const User=require('../Model/user.js');

const index = async (req, res) => {
    let list = await listing.find({});
    let userfav=req.user?req.user.fav:[];
    res.render('listing/index.ejs', { list ,userfav});
};

const createform = (req, res) => {
    res.render('listing/new.ejs');
};
const showform = async (req, res) => {
    let { id } = req.params;
    let item = await listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');


    if (!item) {
        req.flash('error', 'The listing you want access is no more');
        return res.redirect('/listing');
    }
    
    res.render('listing/show.ejs', { item });
}

const editform = async (req, res) => {
    let { id } = req.params;
    let item = await listing.findById(id);
    if (!item) {
        req.flash('error', 'The listing you want edit is no more');
        return res.redirect('/listing');
    }
    let url=item.image.url.replace('/upload','/upload/c_fill,h_250,w_250');
    res.render('listing/edit.ejs', { item,url });
}

const postlisting = async (req, res) => {

    let response=await geocodingClient.forwardGeocode({
               
                  query: req.body.listing.location,
                   limit: 1
                 }) 
                 .send()
    if (!req.body) {
        throw new expressError(400, "please provide the listing details");
    }

    let url=req.file.path;
    let filename=req.file.filename;
    let item = new listing({ ...req.body.listing, owner: req.user._id });
    item.image={url,filename};
    item.geometry=response.body.features[0].geometry;
  
    let user=await User.findById(req.user._id);
    user.recentList.push(item);

     await user.save();
     await item.save();
    req.flash('success', "Successfully created a new listing");
    res.redirect('/listing');
}

const editlisting = async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
        throw new expressError(400, "please provide the listing details");
    }
    let list=await listing.findByIdAndUpdate(id, { ...req.body.listing });
    let response=await geocodingClient.forwardGeocode({
               
                  query: req.body.listing.location,
                   limit: 1
                 }) 
                 .send()
        list.geometry=response.body.features[0].geometry;
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        list.image={url,filename};
    }
    await list.save();
    req.flash('success', "Successfully updated");
    res.redirect(`/listing/${id}`);
}
const deletelisting = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', "Successfully Deleted listing");
    res.redirect(`/listing`);
}

const postfav=async(req,res)=>{
    let {id}=req.params;
    if(!req.user){
        return  res.json({success:false,message:"plaese login first"})
    }
    let user=await User.findById(req.user._id);
      if(user.fav.includes(id)){
        return  res.json({success:true,message:"already in favorite"})
      }
     user.fav.push(id);
     let result=await user.save();
     res.json({success:true,message:"Added to the favorite"})
}

const deltefav=async(req,res)=>{
    let {id}=req.params;
    let user=await User.findByIdAndUpdate(req.user._id, {$pull: {fav: id}}, {new: true});
     if(user.fav.length==0){
        return res.json({success:true,message:"your wishlist is empty"});
     }
res.json({success:true,message:"Successfully remove from wishlist"});

}
module.exports = {
    index,
    createform,
    showform,
    editform,
    postlisting,
    editlisting,
    deletelisting,
    postfav,
    deltefav
}