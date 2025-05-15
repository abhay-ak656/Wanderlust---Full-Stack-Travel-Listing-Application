const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapsync = require('../Middleware/wrapasync.js');
const { isLoggedIn, isowner,validatelisting } = require('../Middleware/middleware.js');
const controller = require('../Controller/listing.js');
const multer=require('multer');
const {Storage}=require('../cloudinary.js');
const upload=multer({storage:Storage})

router.route('/')
    .get(wrapsync(controller.index))
    .post(upload.single('listing[image]'),validatelisting, wrapsync(controller.postlisting))


 router.get('/Aboutus',(req,res)=>{
    res.render('listing/aboutus.ejs')
})
router.get('/new', isLoggedIn, controller.createform);
router.delete('/:id/fav',controller.deltefav);
router.route('/:id')
    .get(wrapsync(controller.showform))
    .post(controller.postfav)
    .patch(upload.single('listing[image]'),validatelisting,wrapsync(controller.editlisting))
    .delete(isLoggedIn, isowner, wrapsync(controller.deletelisting))


router.get('/:id/edit', isLoggedIn, isowner, wrapsync(controller.editform))

module.exports = router;