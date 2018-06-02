const favicon = require('serve-favicon');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
const nodemailer = require('nodemailer'); //requiring Nodemailer
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express(); //Setup Express
const locals = require('express-locals');
const flash = require('connect-flash');
const bodyParser = require('body-parser'); //requiring body-parser
const sessionStore = new session.MemoryStore;
app.use(bodyParser.urlencoded({extended: false})); //requiring body-parser
require('dotenv').config();

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

app.use(function (req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

  //The POST Route
  app.post('/', function (req, res){
    let mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    mailOpts = {
        from: req.body.name + ' &lt;' + req.body.email + '&gt;',
        to: process.env.GMAIL_USER,
        subject: 'New message from contact form at vaninam.ca',
        text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    };
    smtpTrans.sendMail(mailOpts, function (error, response){
        if(error){
            console.log(error);
            res.render("partials/error");
        }
        else{
          res.render("partials/success");
        }
    });
  });  

app
  .use("/public", express.static(__dirname + "/public"))
  .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


