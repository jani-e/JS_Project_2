function test() {
    let targetdiv = document.getElementById('testdiv');
    let url = "https://www.finnkino.fi/xml/TheatreAreas/";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //let data = JSON.parse(xmlhttp.responseText);
            let data = xmlhttp.responseXML;
            console.log(data);
        }
    }
}
function testLastFM() {
    let targetdiv = document.getElementById('testdiv');
    const api = "x";
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