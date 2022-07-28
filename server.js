const express = require('express')
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config()
const request = require('request');

const apiKey = `${process.env.API_KEY}`;

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
