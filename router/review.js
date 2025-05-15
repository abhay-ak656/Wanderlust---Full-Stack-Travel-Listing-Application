const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapsync = require('../Middleware/wrapasync.js');
const { validateReview, isLoggedIn, isreviewOwner } = require('../Middleware/middleware.js');
const controller = require('../Controller/review.js');

//Create list review
router.post('/', validateReview, wrapsync(controller.postreview));

//list review delete
router.delete('/:reviewid', isLoggedIn, isreviewOwner, wrapsync(controller.deltereview))

module.exports = router;