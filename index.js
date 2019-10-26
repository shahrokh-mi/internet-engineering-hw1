const express = require('express');
const fs = require("fs")
const geo = require('geolocation-utils')

app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

var polygons = []
const port = process.env.PORT || 3005;

app.listen(port , ()=> {
    let rawData = fs.readFileSync('sample-data.json');
    let jsonData = JSON.parse(rawData);
    let features =jsonData.features; 
    features.forEach(element => {
        let polygon = {
            name : element.properties.name ,
            coordinates : element.geometry.coordinates[0]
        }

        polygons.push(polygon);

    });
    
    
});

app.get('/', (req,res)=> {
    res.send(polygons);
});


app.get('/gis/testpoint' , (req,res)=>{
    
    location = [parseFloat(req.query.lat) , parseFloat(req.query.lng)];
    resaults = [];
    polygons.forEach(element => {
        if (geo.insidePolygon(location,element.coordinates)){
            resaults.push(element.name);
        }
    });

    res.send({polygons : resaults});

})


app.put('/gis/addpolygon', (req,res) =>{
    data = req.body;

    let polygon = {
        name : data.properties.name ,
        coordinates : data.geometry.coordinates[0]
    }

    polygons.push(polygon);

    res.send({status : "success"});
    
});


