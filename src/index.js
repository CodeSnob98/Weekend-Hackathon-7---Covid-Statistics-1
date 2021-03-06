const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')


app.get('/totalRecovered',(req,res)=>{
    let total = 0;

    function calculateSum(data){
        data.forEach((element) => total=total + element["recovered"]);
        res.send(JSON.stringify({data: {_id: "total", recovered:total}}));
    }
    connection.find().then((data) => calculateSum(data));
    

});
app.get("/totalActive",(req,res)=>{
    let total = 0;

    function calculateSum(data){
        data.forEach((element) => total=total + element["infected"] - element["recovered"]);
        res.send(JSON.stringify({data: {_id: "total", active:total}}));
    }
    connection.find().then((data) => calculateSum(data));

});
app.get("/totalDeath",(req,res)=>{
    let total = 0;

    function calculateSum(data){
        data.forEach((element) => total=total + element["death"]);
        res.send(JSON.stringify({data: {_id: "total", death:total}}));
    }
    connection.find().then((data) => calculateSum(data));


});
app.get("/hotspotStates",(re,res)=>{

    let obj = {data: []};

    function calculateHotspot(data){
        data.forEach((element) =>
        {
            let rate = ((element["infected"] - element["recovered"])/element["infected"]).toFixed(5);
            if( rate > 0.1){
                obj.data.push({state:element["state"],rate});
            }
        }
        );
        res.send(JSON.stringify(obj));
    }
    connection.find().then((data) => calculateHotspot(data));



});
app.get("/healthyStates",(req,res)=>{
    let obj = {data: []};

    function calculateHealthyState(data){
        data.forEach((element) =>
        {
            let mortality = (element["death"]/element["infected"]).toFixed(5);
            if( mortality <  0.005){
                obj.data.push({state:element["state"],mortality});
            }
        }
        );
        res.send(JSON.stringify(obj));
    }
    connection.find().then((data) => calculateHealthyState(data));

});



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;