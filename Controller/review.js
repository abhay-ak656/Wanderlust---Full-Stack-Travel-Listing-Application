const review = require('../Model/review.js');
const listing = require('../Model/liststing.js');

const postreview = async (req, res) => {
    let { id } = req.params;

    let listingitem = await listing.findById(id);
    let reviewitem = new review({ ...req.body.review, author: req.user._id });

    listingitem.reviews.push(reviewitem);

    await reviewitem.save();
    await listingitem.save();

    req.flash('success', "New review Created");
    res.redirect(`/listing/${id}`);
};

    const deltereview = async (req, res) => {
    let { id, reviewid } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await review.findByIdAndDelete(reviewid);

    req.flash('success', "Review deleted");
    res.redirect(`/listing/${id}`)
};
module.exports = {
    postreview,
    deltereview
}