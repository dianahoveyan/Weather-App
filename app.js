let weather = {
    fetchWeather: function (city) {
        console.log(city , '@#####');
        fetch(`http://localhost:3000/api/getWeather/?city=${city}`)
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function (value = document.querySelector(".search-bar").value){
        if(value) {
            document.querySelector(".search-bar").value = value;
        }
        console.log('here!!');
        this.fetchWeather(value);
    }
};

document
    .querySelector('.search button')
    .addEventListener("click", function (){
        weather.search();
    });
document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (e){
        if (e.key == "Enter") {
            weather.search();
    }
})
weather.fetchWeather("Denver");


const searchInput = document.getElementById('city-input');
const searchWrapper = document.querySelector('.search');
const resultsWrapper = document.querySelector('.results');
console.log(searchInput);
searchInput.addEventListener('keyup', () => {
    console.log('keyup');
    fetch(`http://localhost:3000/api/options?minPopulation=1000000&namePrefix=${searchInput.value}`)
    .then(response => {
        response.json()
            .then(({ data }) => {
                console.log(data);
                renderResults(data);
            })
    })
    .catch(err => console.error(err));
})

function renderResults(results = []) {
    if (!results.length) {
        return searchWrapper.classList.remove('show');
    }

    const content = results
        .map(({city}) => {
            return `<li onclick="weather.search('${city}'), searchWrapper.classList.remove('show')">${city}</li>`;
        })
        .join('');

    searchWrapper.classList.add('show');
    resultsWrapper.innerHTML = `<ul>${content}</ul>`;

}

const debounce = (fn,ms) => {
    let timeout;
    return function (){
        const fnCall = () => { fn.apply(this, arguments)}
        clearTimeout(timeout);
        timeout =setTimeout(fnCall, ms)
    }
}
renderResults = debounce(renderResults,200)
