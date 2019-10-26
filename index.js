const express = require('express');
const fs = require("fs")
const geo = require('geolocation-utils')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var polygons = []
const port = process.env.PORT || 3000;  
app.listen(port , ()=> {
    let jsonData = JSON.parse(fs.readFileSync('sample-data.json'));
    let features =jsonData.features; 
    features.forEach(element => {
        let polygon = {
            name : element.properties.name ,
            coordinates : element.geometry.coordinates[0]
        }

        polygons.push(polygon);

    });
    
    
});

app.get('/gis/testpoint' , (request,result)=>{
    
    location = [parseFloat(request.query.lat) , parseFloat(request.query.lng)];
    resaults = [];
    polygons.forEach(item => {
        if (geo.insidePolygon(location,item.coordinates)){
            resaults.push(item.name);
        }
    });

    result.send({polygons : resaults});

})

app.put('/gis/addpolygon', (request,result) =>{
    data = request.body;

    let polygon = {
        name : data.properties.name ,
        coordinates : data.geometry.coordinates[0]
    }

    polygons.push(polygon);

    result.send({status : "success"});
    
});




