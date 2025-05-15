

if(process.env.NODE_ENV !='production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodoverride = require('method-override');
const ejsmate = require('ejs-mate');
const expressError = require('./expreeserror/expresserror.js');
const cookieparser=require('cookie-parser');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const MongoStore = require('connect-mongo');

const listing=require('./router/listings.js');
const review=require('./router/review.js');
const user=require('./router/user.js');
const category=require('./router/catoegory.js');

// let Mongoose_URL = "mongodb://127.0.0.1:27017/wanterlust";
const Atlas_url=process.env.ATLASDB_URL2
console.log(Atlas_url);
async function main() {
 try {
    await mongoose.connect(Atlas_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true, // Needed if you're NOT using 'mongodb+srv'
      tlsAllowInvalidCertificates: false // temporarily set to true ONLY for debugging
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }

}

main().then(res => console.log("Successful connection to MongoDb")).catch(err => console.log(err));

app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieparser("mysecrectkey"));

const store=MongoStore.create({
    mongoUrl:Atlas_url,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    res.locals.success=req.flash('success'); 
    res.locals.error=req.flash('error');
    res.locals.currusr=req.user;
    res.locals.url=req.originalUrl;
    next();
})

app.use('/listing',listing);
app.use('/listing/:id/review',review);
app.use('/listing/user',user);
app.use('/listing/category',category);

app.all("/*splat", (req, res, next) => {
    next(new expressError(404, "page not found"));
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something is with internal server" } = err;
    res.status(status).render('listing/error.ejs',{message});
})

app.listen(2005, (req, res) => {
    console.log("Server is Working with project");
})
