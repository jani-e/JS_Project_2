const api = getApiKey(); //apikey temporary solution
let targetdiv = document.getElementById('testdiv');

function test() {
    let url = "https://www.finnkino.fi/xml/TheatreAreas/";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = xmlhttp.responseXML;
            console.log(data);
        }
    }
}
function testLastFM() {
    let url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Cher&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            console.log(data);
        }
    }
}
let data = null;
function getTopArtists() {
    const url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            let list = "<ul>";
            console.log(data)
            for (i = 0; i < data.artists.artist.length; i++) {
                list += "<li>" + data.artists.artist[i].name + "</li>";
            }
            list += "</ul>";
            targetdiv.innerHTML = list;
        }
    }
}