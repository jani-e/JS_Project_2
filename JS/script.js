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