async function fetchAsync () {
    var where = document.getElementById("whereField").value
    if (!where) {return;}
    where = where.replace(' ', '+');
    where = asciiize(where)
    let response = await fetch("https://weatherdbi.herokuapp.com/data/weather/"+where);
    console.log(response);
    let data = await response.json();
    return data;
};

function asciiize(str) {
    if (str.includes("č")) {str = str.replace("č", "c");}
    if (str.includes("ć")) {str = str.replace("ć", "c");}
    if (str.includes("š")) {str = str.replace("š", "s");}
    if (str.includes("đ")) {str = str.replace("đ", "dj");}
    if (str.includes("ž")) {str = str.replace("ž", "z");}
    if (str.includes("Č")) {str = str.replace("Č", "C");}
    if (str.includes("Ć")) {str = str.replace("Ć", "C");}
    if (str.includes("Š")) {str = str.replace("Š", "S");}
    if (str.includes("Đ")) {str = str.replace("Đ", "Dj");}
    if (str.includes("Ž")) {str = str.replace("Ž", "Z");}
    return str;
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
}

function prevod(rijec) {
    const rjecnik = {"Monday": "Ponedjeljak", "Tuesday": "Utorak", "Wednesday": "Srijeda",
    "Thursday": "Četvrtak", "Friday": "Petak", "Saturday": "Subota", "Sunday": "Nedjelja",
    "Clear": "Vedro", "Sunny": "Sunčano", "Thunderstorm": "Oluja",
    "Scattered thunderstorms": "Mjestimične oluje", "Mostly sunny": "Pretežno sunčano",
    "Isolated thunderstorms": "Lokalne oluje", "Partly cloudy": "Djelimično oblačno",
    "Clear with periodic clouds": "Vedro s povremenom naoblakom", "Cloudy": "Oblačno",
    "Mostly cloudy": "Pretežno oblačno", "Haze": "Izmaglica", "Widespread dust": "Naleti prašine",
    "Light rain showers": "Slabi pljuskovi","Rain": "Kiša"};
    if (rijec in rjecnik) {
        return rjecnik[rijec];
    }
    else {
        return rijec;
    }
}

function preloadImage(url) {
    var img=new Image();
    img.src=url;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}  

function setSvg(condition) {
    var r = document.documentElement;
    if (condition.includes("loud") || condition.includes("ain") || condition.includes("hunder")) {
        r.style.setProperty('--svg', '/static/cloudy.svg');
    }
    else {
        r.style.setProperty('--svg', '/static/sunny.svg');
    }
}

function clearData() {
    document.getElementById("iconToday").src = "";
    document.getElementById("region").innerHTML = "";
    document.getElementById("commentToday").innerHTML = "";
    document.getElementById("dayhour").innerHTML = "";
    document.getElementById("temp").innerHTML = "";
    document.getElementById("humidity").innerHTML = "";
    document.getElementById("precip").innerHTML = "";
    document.getElementById("wind").innerHTML = "";
}

function writeWeatherData() {
    document.getElementById("loading").innerHTML = "Učitavanje...";
    document.getElementById("submitBtn").disabled = true;
    clearData()
    fetchAsync().then((data) => {
        try {
            preloadImage(data["currentConditions"]["iconURL"])
        } catch {
            document.getElementById("loading").innerHTML = "Lokacija nije pronađena.";
            document.getElementById("submitBtn").disabled = false;
            return
        }        
        document.getElementById("loading").innerHTML = "";
        document.getElementById("submitBtn").disabled = false;

        document.title = "Vrijeme - "+titleCase(data["region"].split(',')[0]);
        document.getElementById("iconToday").src = data["currentConditions"]["iconURL"];
        document.getElementById("region").innerHTML = data["region"];
        document.getElementById("commentToday").innerHTML = prevod(data["currentConditions"]["comment"]);

        setSvg(data["currentConditions"]["comment"]);
        let dayhour = data["currentConditions"]["dayhour"].split(' ');
        document.getElementById("dayhour").innerHTML = [prevod(dayhour[0]), dayhour[1], dayhour[2]].join(' ');
        document.getElementById("temp").innerHTML = "Temperatura: " + data["currentConditions"]["temp"]["c"] + "°C";
        document.getElementById("humidity").innerHTML = "Vlažnost vazduha: " + data["currentConditions"]["humidity"];
        document.getElementById("precip").innerHTML = "Šansa za padavine: " + data["currentConditions"]["precip"];
        document.getElementById("wind").innerHTML = "Brzina vjetra: " + data["currentConditions"]["wind"]["km"] + "km/h";
        
    });
}

document.getElementById("whereField").addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        writeWeatherData()
    }
});

document.getElementById("submitBtn").addEventListener("click", () => writeWeatherData());
