const apiKey = "751bf7639cc5417191a62458260201";
let isCelsius = true;

function getWeather(city = null) {
    const location = city || document.getElementById("locationInput").value;
    const error = document.getElementById("error");
    const card = document.getElementById("weatherCard");

    if (!location) {
        error.textContent = "Please enter a city name";
        return;
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                error.textContent = data.error.message;
                card.style.display = "none";
                return;
            }

            error.textContent = "";
            card.style.display = "block";

            document.getElementById("city").textContent =
                `${data.location.name}, ${data.location.country}`;

            updateTemperature(data);

            document.getElementById("condition").textContent =
                data.current.condition.text;

            document.getElementById("humidity").textContent =
                `Humidity: ${data.current.humidity}%`;

            document.getElementById("wind").textContent =
                `Wind: ${data.current.wind_kph} km/h`;

            document.getElementById("icon").src =
                "https:" + data.current.condition.icon;

            showForecast(data.forecast.forecastday);
        });
}

function updateTemperature(data) {
    document.getElementById("temperature").textContent =
        isCelsius ? `${data.current.temp_c} °C` : `${data.current.temp_f} °F`;
}

function toggleUnit() {
    isCelsius = !isCelsius;
    getWeather();
}

function showForecast(days) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    days.forEach(day => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${day.date}</p>
            <img src="https:${day.day.condition.icon}" width="40">
            <p>${day.day.avgtemp_c} °C</p>
        `;
        forecastDiv.appendChild(div);
    });
}

function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        getWeather(coords);
    });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
