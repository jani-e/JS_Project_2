const api = getApiKey(); //apikey temporary solution
let currentArtistName = null; //keeping record of current artist
let resultLimit = 20; //limiting results from server response
getArtists(); //functions starts once website is loaded fully

function apiCall(url, callbackFunction) { //reduces repetive code for xmlhttp, accepts url parameter, fetches response from server and calls function with response attached
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true); //url contains apikey and search parameters that are set in other functions
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = JSON.parse(xmlhttp.responseText);
            callbackFunction(response); //call function based on parameters and add server response to it as parameter
        }
    }
}

function getArtists() {
    let limit = 20; //artist limit
    let url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=" + limit + "&api_key=" + api + "&format=json";
    apiCall(url, showArtists); //send parameters url and next function to apiCall
}

function showArtists(response) { //shows artists from response received from apicall function
    let ul = document.getElementById('artistsList');
    for (let i = 0; i < response.artists.artist.length; i++) { //loop through response json and generate list of artists
        let listItem = document.createElement('li');
        let artistRank = document.createElement('span');
        let artistName = document.createElement('span');
        artistRank.innerHTML = "#" + (i + 1);
        artistRank.setAttribute('class', 'artistRank');
        artistName.innerHTML = response.artists.artist[i].name;
        listItem.appendChild(artistRank);
        listItem.appendChild(artistName);
        ul.appendChild(listItem);
    }
    getArtist(response.artists.artist[0].name); //start getArtist with first artist in the list
    listenArtist(); //start listenArtist function
}

function listenArtist() { //adds dynamically eventlistener to every artist in the list
    let artists = document.getElementById('artistsList').children;
    for (let value of artists) {
        value.addEventListener('click', function () {
            let selectedArtistName = value.children[1].innerHTML; //get name of the artist clicked in the list
            getArtist(selectedArtistName); //start getArtist with selected artist name
        })
    }
}

function getArtist(selectedArtistName) { //sets selected artist as current artist, gets artist details from server
    currentArtistName = selectedArtistName;
    let artistName = document.getElementById('artistName');
    artistName.innerHTML = selectedArtistName;
    let url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + selectedArtistName + "&api_key=" + api + "&format=json";
    apiCall(url, updateArtist) //send parameters url and next function to apiCall
}

function updateArtist(response) { //receive response from apicall and update artist info based on response
    let artistSummary = document.getElementById('artistSummary');
    artistSummary.innerHTML = response.artist.bio.summary;
    getAlbums(); //start getAlbums function
}

function getAlbums() { //sets url with parameters to get albums from current artist
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&limit=" + resultLimit + "&artist=" + currentArtistName + "&api_key=" + api + "&format=json";
    apiCall(url, showAlbums) //send parameters url and next function to apiCall
}

function showAlbums(response) { //receive response from apicall and show top 20 albums of current artist
    let ul = document.getElementById('artistAlbums');
    ul.innerHTML = null; //resets albums list
    let albumHeader = document.getElementById('albumHeader');
    albumHeader.innerHTML = currentArtistName + "'s Top " + resultLimit + " albums";
    for (let i = 0; i < response.topalbums.album.length; i++) {
        let albumItem = document.createElement('li');
        albumItem.setAttribute('class', 'flex-container'); //using some flexbox here to put all elements in same line

        let leftBlock = document.createElement('div');
        leftBlock.setAttribute('class', 'imageDiv');
        let rightBlock = document.createElement('div');

        let albumImage = document.createElement('img');
        let albumName = document.createElement('h3');
        let albumArtist = document.createElement('span');
        let albumPlayCount = document.createElement('span');

        albumImage.src = response.topalbums.album[i].image[2]["#text"];
        albumName.innerHTML = response.topalbums.album[i].name;
        albumArtist.innerHTML = currentArtistName;
        albumPlayCount.innerHTML = "<br><br>Playcount: " + response.topalbums.album[i].playcount;

        leftBlock.appendChild(albumImage);
        rightBlock.appendChild(albumName);
        rightBlock.appendChild(albumArtist);
        rightBlock.appendChild(albumPlayCount);

        albumItem.appendChild(leftBlock);
        albumItem.appendChild(rightBlock);

        ul.appendChild(albumItem);
    }
    getAlbumInfo(response.topalbums.album[0].name); //start getalbuminfo with top album of current artist
    listenAlbum(); //start listenalbum function
}

function getAlbumInfo(albumName) { //function to get album info from server with some character checking in names, not all tracks and artists have ids so names are used instead
    if (albumName.includes("+")) { //error handling if name contains + -sign
        albumName = albumName.replace(/\+/g, "%2b"); //replace plus with url ascii enconding value
    } else if (albumName.includes("&amp;")) { //error handling if name contains & -sign, does not always work
        albumName = albumName.replace(/\&amp;/g, "%26"); //replace & with url ascii enconding value
    }
    const url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" + api + "&artist=" + currentArtistName + "&album=" + albumName + "&format=json";
    apiCall(url, showAlbumInfo); //send parameters url and next function to apiCall
}

function listenAlbum() { //adds dynamically event listener to album list
    let albums = document.getElementById('artistAlbums').children;
    for (let i = 0; i < albums.length; i++) {
        albums[i].addEventListener('click', function () {
            let selectedAlbum = albums[i].children[1].children[0].innerHTML; //variable for selected album
            getAlbumInfo(selectedAlbum); //start getalbuminfo with select album name
        })
    }
}

function showAlbumInfo(response) { //shows album info and tracks
    let name = document.getElementById('albumName');
    let artist = document.getElementById('albumArtist');
    let tracks = document.getElementById('albumTracks');
    let published = document.getElementById('albumPublished');
    let summary = document.getElementById('albumSummary');
    let ul = document.getElementById('albumSongs');
    ul.innerHTML = null; //resets songs list
    name.innerHTML = response.album.name;
    artist.innerHTML = "Artist: " + response.album.artist;

    tracks.innerHTML = "Tracks: N/A"; //sets N/A in case info not found later
    published.innerHTML = "Published: N/A";
    summary.innerHTML = "Summary<br><br> N/A"

    if (response.album.tracks.track.length !== undefined) { //some albums in json api are missing tracks, so displaying N/A values if api info missing
        tracks.innerHTML = "Tracks: " + response.album.tracks.track.length;
        published.innerHTML = "Published: " + response.album.wiki.published.substring(0, 11);
        summary.innerHTML = "Summary<br><br>" + response.album.wiki.summary;
        for (let i = 0; i < response.album.tracks.track.length; i++) { //loops through all soundtracks in the album
            let songItem = document.createElement('li');
            songItem.setAttribute('class', 'flex-container'); //another flexbox to align all elements in one line per track
    
            let songName = document.createElement('h3');
            let songNameDiv = document.createElement('div');
            songNameDiv.setAttribute('class', 'divLeft');
            songNameDiv.appendChild(songName);
    
            let songDuration = document.createElement('p');
            let songDurationDiv = document.createElement('div');
            songDurationDiv.setAttribute('class', 'divCenter');
            songDurationDiv.appendChild(songDuration);
    
            let songUrl = document.createElement('a');
            songUrl.setAttribute('target', '_blank');
            let songUrlDiv = document.createElement('div');
            songUrlDiv.setAttribute('class', 'divRight');
            songUrlDiv.appendChild(songUrl);
    
            songName.innerHTML = (i+1) + " - " + response.album.tracks.track[i].name;
    
            let trackDuration = response.album.tracks.track[i].duration;
            let minutes = Math.floor(trackDuration / 60); //server response delivers soundtrack duration in seconds, calculating minutes and remaining seconds
            let seconds = trackDuration % 60;
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            let duration = minutes + ":" + seconds; //minutes and seconds to display in format m:s
            songDuration.innerHTML = duration;
    
            songUrl.innerHTML = "Listen track";
            songUrl.href = response.album.tracks.track[i].url;
    
            songItem.appendChild(songNameDiv);
            songItem.appendChild(songDurationDiv);
            songItem.appendChild(songUrlDiv);
    
            ul.appendChild(songItem);
        }
    }
}

//searchbar

document.getElementById('searchText').addEventListener('keyup', function (event) { //listens user input and shows similar artists to user input
    if (event.code === 'Enter') { //if enter, start searchArtist function
        searchArtist();
    }
    let datalist = document.getElementById('suggestionsList'); //pops up a datalist under search bar suggesting artists
    datalist.innerHTML = null; //empty previous datalist
    let searchText = document.getElementById('searchText');
    let searchValue = searchText.value.trim(); //remove empty spaces before and after search text
    if (searchValue.length > 3 && searchValue.length < 10) { //start xmlhttp api call when there's more than 3 characters and max 10 characters
        const url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + searchValue + "&api_key=" + api + "&format=json";
        let xmlhttp = new XMLHttpRequest(); //could also be replaced with apicall function
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let data = JSON.parse(xmlhttp.responseText);
                for (let i = 0; i < 5 && i < data.results.artistmatches.artist.length; i++) { //loops through results max 5 times
                    let option = document.createElement('option');
                    option.innerHTML = data.results.artistmatches.artist[i].name;
                    datalist.appendChild(option); //add found result to the datalist
                }
                datalist.focus(); //focus added to show datalist while writing
            }
        }
    }
});
document.getElementById('searchText').addEventListener('change', function () { //triggers when option is selected from list
    searchArtist();
});
document.getElementById('searchSubmit').addEventListener('click', function () { //triggers when clicking search button
    searchArtist();
});

function searchArtist() { //fetch selected or written search value and send query to server
    let searchText = document.getElementById('searchText');
    let searchValue = searchText.value.trim();
    searchText.value = null; //reset search textfield
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + searchValue + "&api_key=" + api + "&format=json";
    let xmlhttp = new XMLHttpRequest(); //could also be replaced with apicall function
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            getArtist(data.results.artistmatches.artist[0].name); //start getartist function with most similar artist to search value
        }
    }
}