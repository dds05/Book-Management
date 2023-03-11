const express = require("express");
const userRoutes=require('./routes/userRoutes');
const bookRoutes=require('./routes/bookRoutes');
const dotenv=require('dotenv');
const connectDB = require("./config/db");
const {  errorHandler, pageisNotFound } = require("./middlewares/errorM");
const path=require('path');
const app = express();
dotenv.config();
// MongoDB Connect
connectDB();
app.use(express.json())

// for user
app.use('/api/users',userRoutes);
// for books
app.use('/api/book',bookRoutes);


// FOR DEPLOYMENT 
__dirname=path.resolve();
if(process.env.NODE_ENV==="production")
{
  app.use(express.static(path.join('frontend/build')));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve('frontend','build','index.html'));
  });
}
else{
  app.get("/", (req, res) => {
    res.send("Hello World");
  });
}

app.use(pageisNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("server started on port 5000"));