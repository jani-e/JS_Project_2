const api = getApiKey(); //apikey temporary solution
let currentArtistName = null;
getArtists();

function apiCall(url, callbackFunction) { //reduces repetive code for xmlhttp, accepts url parameter, fetches response from server and calls function with response attached
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = JSON.parse(xmlhttp.responseText);
            callbackFunction(response);
        }
    }
}

function getArtists() {
    let limit = 20;
    let url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=" + limit + "&api_key=" + api + "&format=json";
    apiCall(url, showArtists);
}

function showArtists(response) {
    let ul = document.getElementById('artistsList');
    let artistsData = response;
    console.log(artistsData)
    for (let i = 0; i < artistsData.artists.artist.length; i++) {
        let listItem = document.createElement('li');
        let artistRank = document.createElement('span');
        let artistName = document.createElement('span');
        artistRank.innerHTML = "#" + (i + 1);
        artistRank.setAttribute('class', 'artistRank');
        artistName.innerHTML = artistsData.artists.artist[i].name;
        listItem.appendChild(artistRank);
        listItem.appendChild(artistName);
        ul.appendChild(listItem);
    }
    console.log("getArtists")
    console.log(artistsData)
    getArtist(artistsData.artists.artist[0].name);
    listenArtist();
}

function listenArtist() {
    let artists = document.getElementById('artistsList').children;
    for (let value of artists) {
        value.addEventListener('click', function () {
            let selectedArtistName = value.children[1].innerHTML;
            getArtist(selectedArtistName);
        })
    }
}

function getArtist(selectedArtistName) {
    currentArtistName = selectedArtistName;
    let artistName = document.getElementById('artistName');
    artistName.innerHTML = selectedArtistName;
    let url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + selectedArtistName + "&api_key=" + api + "&format=json";
    apiCall(url, updateArtist)
}

function updateArtist(response) {
    let artistSummary = document.getElementById('artistSummary');
    console.log(response)
    artistSummary.innerHTML = response.artist.bio.summary;
    getAlbums(currentArtistName)
}

function xupdateArtist(selectedArtistName) { //poista
    /*currentArtistName = selectedArtistName;
    let artistName = document.getElementById('artistName');
    let artistSummary = document.getElementById('artistSummary');
    artistName.innerHTML = selectedArtistName;
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + selectedArtistName + "&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);*/
            artistSummary.innerHTML = data.artist.bio.summary;
            getAlbums(selectedArtistName);
        }
    //}
//}

//jatka refactor

function getAlbums(selectedArtistName) {
    let ul = document.getElementById('artistAlbums');
    ul.innerHTML = null; //resets albums list
    let artistName = selectedArtistName;
    let resultLimit = 20;
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&limit=" + resultLimit + "&artist=" + artistName + "&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            let albumHeader = document.getElementById('albumHeader');
            albumHeader.innerHTML = selectedArtistName + "'s Top " + resultLimit + " albums";
            for (let i = 0; i < data.topalbums.album.length; i++) {
                let albumItem = document.createElement('li');
                albumItem.setAttribute('class', 'flex-container');

                let leftBlock = document.createElement('div');
                let rightBlock = document.createElement('div');

                let albumImage = document.createElement('img');
                let albumName = document.createElement('h3');
                let albumArtist = document.createElement('span');
                let albumPlayCount = document.createElement('span');

                albumImage.src = data.topalbums.album[i].image[2]["#text"];
                albumName.innerHTML = data.topalbums.album[i].name;
                albumArtist.innerHTML = artistName;
                albumPlayCount.innerHTML = "<br><br>Playcount: " + data.topalbums.album[i].playcount;

                leftBlock.appendChild(albumImage);
                rightBlock.appendChild(albumName);
                rightBlock.appendChild(albumArtist);
                rightBlock.appendChild(albumPlayCount);

                albumItem.appendChild(leftBlock);
                albumItem.appendChild(rightBlock);

                ul.appendChild(albumItem);
            }
            console.log("getAlbums")
            console.log(data)
            getAlbumInfo(data.topalbums.album[0].name);
            listenAlbum();
        }
    }
}

function getAlbumInfo(album) {
    let name = document.getElementById('albumName');
    let artist = document.getElementById('albumArtist');
    let published = document.getElementById('albumPublished');
    let summary = document.getElementById('albumSummary');
    let ul = document.getElementById('albumSongs');
    ul.innerHTML = null; //resets songs list
    let albumName = album;
    const url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" + api + "&artist=" + currentArtistName + "&album=" + albumName + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            console.log("getSongs")
            console.log(data)
            name.innerHTML = data.album.name;
            artist.innerHTML = data.album.artist;
            published.innerHTML = data.album.wiki.published.substring(0, 11);
            summary.innerHTML = data.album.wiki.summary;
            for (let i = 0; i < data.album.tracks.track.length; i++) {
                let songItem = document.createElement('li');
                let songName = document.createElement('span');
                songName.innerHTML = data.album.tracks.track[i].name;
                songItem.appendChild(songName);
                ul.appendChild(songItem);
            }

        }
    }
}

function listenAlbum() {
    let albums = document.getElementById('artistAlbums').children;
    for (let i = 0; i < albums.length; i++) {
        albums[i].addEventListener('click', function () {
            let selectedAlbum = albums[i].children[1].children[0].innerHTML;
            console.log("test:" + selectedAlbum)
            getAlbumInfo(selectedAlbum);
        })
    }
}

document.getElementById('searchText').addEventListener('keyup', function (event) {
    if (event.code === 'Enter') {
        searchArtist();
    }
    let datalist = document.getElementById('suggestionsList');
    datalist.innerHTML = null;
    let searchText = document.getElementById('searchText');
    let searchValue = searchText.value.trim();
    if (searchValue.length > 3 && searchValue.length < 10) {
        const url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + searchValue + "&api_key=" + api + "&format=json";
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let data = JSON.parse(xmlhttp.responseText);
                console.log(data)

                for (let i = 0; i < 5 && i < data.results.artistmatches.artist.length; i++) {
                    let option = document.createElement('option');
                    option.innerHTML = data.results.artistmatches.artist[i].name;
                    console.log(data.results.artistmatches.artist[i].name);
                    datalist.appendChild(option);
                }
                datalist.focus();
            }
        }
    }
});
document.getElementById('searchSubmit').addEventListener('click', function () {
    searchArtist();
});

function searchArtist() {
    let searchText = document.getElementById('searchText');
    let searchValue = searchText.value.trim();
    searchText.value = null; //reset search textfield
    console.log(searchValue)
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + searchValue + "&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            console.log(data);
            updateArtist(data.results.artistmatches.artist[0].name);
        }
    }
}



/*
todo:

error: bruno mars albums not showing any songs
        + kanye west 808
error: null albums
display current selection (artist, album) css selected

add track info

refactor code: currentArtistName variable outside of functions: update functions?
combine xmlhttp calls together to accept parameters and return response
*/