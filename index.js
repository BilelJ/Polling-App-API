var express = require('express');
var app = express();
var pollsRoutes = require('./routes/polls');
var bodyParser = require('body-parser');
var cors = require("cors");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());
app.use('/api/polls',pollsRoutes);

app.get('/',(req,res)=>{
    res.send("Nothing to do here");
})



app.listen(process.env.PORT,()=>console.log('App is up and running on port ' + process.env.PORT));

