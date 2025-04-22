import mongoose, { connect } from 'mongoose';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import noteRoutes from './routes/noteRoutes.js'
import passport from 'passport';
import configurePassport from './config/passport.js';
import session from 'express-session';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import accountRoutes from './routes/accountRoutes.js'
dotenv.config();
const app = express();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())
configurePassport(passport)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("MongoDB Connection Error:", err));
mongoose.set('debug', true);
// Add this header in your Express server setup (if you control the backend):
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Adjust this as needed
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/app/notes', noteRoutes)
app.use('/app', userRoutes)
app.use('/app/blogs',blogRoutes)
app.use('/app', accountRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}` )
})