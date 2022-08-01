const express = require('express')
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config()
const request = require('request');
const router = express.Router();

const apiKey = `${process.env.API_KEY}`;
const geoApiKey = `${process.env.GEO_API_KEY}`

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.././public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/getWeather", (req, response, next) => {
    console.log(req.query, 'req.query');
    let {city} = req.query;
    request.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
        function (err, res, body) {
            let data = JSON.parse(body)
            console.log(data, '%%%%%');
            if (!err && res.statusCode == 200) {
                response.send(data)
                // Successful response
                // console.log(body); // Displays the response from the API
            } else {
                console.log(err);
            }
        }
    );
});
app.get("/api/options", (req, res, next) => {
    const { namePrefix } = req.query;
    const options = {
        method: 'GET',
        url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
        qs: {namePrefix, minPopulation: '1000000'},
        headers: {
            'X-RapidAPI-Key': "437c5869a1msh0c3f199a4089d28p17927cjsn8cfa66c74199",
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
            useQueryString: true
        }
    };
    request(options, function (error, response, body) {

        if (error) throw new Error(error);

        console.log('>>>>>>', body);

        res.send(body)
    });
});

app.listen(port, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", port);
})
