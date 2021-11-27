const api = getApiKey(); //apikey temporary solution
let currentArtistName = null;

function getArtists() {
    let artistsData = null;
    let ul = document.getElementById('artistsList');
    let limit = 20;
    const url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=" + limit + "&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            artistsData = JSON.parse(xmlhttp.responseText);
            /*artistsData.sort(function(a, b) { //ei toimi
                return parseInt(a.artists.artist["#playcount"]) - parseInt(b.artists.artist["#playcount"]);
            });*/
            ul.removeChild(ul.childNodes[1]);
            for (let i = 0; i < artistsData.artists.artist.length; i++) {
                let listItem = document.createElement('li');
                //let artistPlaycount = document.createElement('span');
                let artistName = document.createElement('span');
                //artistPlaycount.innerHTML = artistsData.artists.artist[i].playcount;
                //artistPlaycount.setAttribute('class', 'artistPlaycount');
                artistName.innerHTML = artistsData.artists.artist[i].name;
                listItem.appendChild(artistName);
                //listItem.appendChild(artistPlaycount);
                ul.appendChild(listItem);
            }
            console.log("getArtists")
            console.log(artistsData)
            updateArtist(artistsData.artists.artist[0].name); //show top 1 artist initially
            listenArtist();
        }
    }
}
let body = document.body;
body.addEventListener("load", getArtists());

function listenArtist() {
    let artists = document.getElementById('artistsList').children;
    for (let value of artists) {
        value.addEventListener('click', function () {
            let selectedArtistName = value.children[0].innerHTML; //muuta children[1], jos otat takaisin artistPlaycount
            updateArtist(selectedArtistName);
        })
    }
}

function updateArtist(selectedArtistName) {
    currentArtistName = selectedArtistName;
    let artistName = document.getElementById('artistName');
    let artistSummary = document.getElementById('artistSummary');
    //let artistImage = document.getElementById('artistImage');
    artistName.innerHTML = selectedArtistName;
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + selectedArtistName + "&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            artistSummary.innerHTML = data.artist.bio.summary;
            //artistImage.src = data.artist.image[1]["#text"];
            getAlbums(selectedArtistName);
        }
    }
}

function getAlbums(selectedArtistName) {
    let ul = document.getElementById('artistAlbums');
    ul.innerHTML = null; //resets albums list
    let artistName = selectedArtistName;
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+ artistName +"&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            for (let i = 0; i < data.topalbums.album.length; i++) {
                let albumItem = document.createElement('li');
                let albumName = document.createElement('span');
                albumName.innerHTML = data.topalbums.album[i].name;
                albumItem.appendChild(albumName);
                ul.appendChild(albumItem);
            }
            console.log("getAlbums")
            console.log(data)
            getSongs(data.topalbums.album[0].name);
            listenAlbum();
        }
    }
}

function getSongs(album) {
    let ul = document.getElementById('albumSongs');
    ul.innerHTML = null; //resets songs list
    let albumName = album;
    const url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" + api + "&artist=" + currentArtistName + "&album=" + albumName + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            for (let i = 0; i < data.album.tracks.track.length; i++) {
                let songItem = document.createElement('li');
                let songName = document.createElement('span');
                songName.innerHTML = data.album.tracks.track[i].name;
                songItem.appendChild(songName);
                ul.appendChild(songItem);
            }
            console.log("getSongs")
            console.log(data)
        }
    }
}

function listenAlbum() {
    let albums = document.getElementById('artistAlbums').children;
    for (let i = 0; i < albums.length; i++) {
        albums[i].addEventListener('click', function() {
            let selectedAlbum = albums[i].children[0].innerHTML;
            getSongs(selectedAlbum);
        })
    }
}