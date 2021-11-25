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
let artistsData = null;
function getTopArtists() {
    let ul = document.getElementById('topArtists');
    const url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            artistsData = JSON.parse(xmlhttp.responseText);
            ul.removeChild(ul.childNodes[1]);
            for (let i = 0; i < artistsData.artists.artist.length; i++) {
                let listItem = document.createElement('li');
                let artistIndex = document.createElement('span');
                let artistName = document.createElement('span');
                artistIndex.innerHTML = "[" + (i + 1) + "] ";
                artistIndex.setAttribute('class', 'artistIndex');
                artistName.innerHTML = artistsData.artists.artist[i].name;
                listItem.appendChild(artistIndex);
                listItem.appendChild(artistName);
                ul.appendChild(listItem);
            }
            listenArtist();
        }
    }
}
let body = document.body;
body.addEventListener("load", getTopArtists());

function listenArtist() {
    let artists = document.getElementById('topArtists').children;
    for (let i = 0; i < artists.length; i++) {
        artists[i].addEventListener('click', function () {
            console.log(artists[i].children[1].innerHTML)
            let testdata = artists[i].children[1].innerHTML;
            let test = document.getElementById('testArtist').innerHTML = testdata;
        })
    }
}

