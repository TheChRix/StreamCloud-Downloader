// ==UserScript==
// @name         TheChRix StreamCloud Downloader
// @namespace    https://github.com/TheChRix
// @version      0.1
// @description  Descarga cualquier cancion de SoundCloud.com en el fichero original
// @author       TheChRix
// @match        https://soundcloud.com/*
// @grant        none
// ==/UserScript==

let laUrl = window.location.href;
let client_id = "aps6FCJllFHVcpRtxEeVOiKRS2LZ9Uaa";

(function () {
    'use strict';

    document.addEventListener('click', function (event) {
        let zona = document.getElementsByClassName("soundActions sc-button-toolbar listenEngagement__actions soundActions__medium");
        if (zona != null) {
            if (!zona[0].innerHTML.includes("Descargar")) {
                zona[0].innerHTML += "<button type='button' class='sc-button-download sc-button sc-button-medium sc-button-responsive sc-button-cta' id='descarga'>Descargar</button>";
                zona[0].innerHTML = zona[0].innerHTML.replace("Buy WAV", "")
                let boton = document.getElementById('descarga')
                boton.addEventListener('click', function () { getJSON() }, false);
            }
        }

    }, false);

    let getJSON = function () {
        let xhr = new XMLHttpRequest();
        let url = "https://api.soundcloud.com/resolve.json?url=" + laUrl + "&client_id=" + client_id;
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 200) {
                let id = xhr.response.id;
                let nombre = xhr.response.title + "." + xhr.response.original_format;
                let linkDescarga = "https://api.soundcloud.com/tracks/" + id + "/stream?client_id=" + client_id;
                getLink(linkDescarga, nombre);
            } else {
                console.error("Error obteniendo la respuesta")
            }
        };
        xhr.send();
    };

    let getLink = function (url, nombre) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 200) {
                let urlFichero = xhr.responseURL;
                getBlob(urlFichero, nombre);
            } else {
                console.error("Error obteniendo el enlace");
            }
        };
        xhr.send();
    };


    let getBlob = function (url, nombre) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 200) {
                saveData(xhr.response, nombre);
            } else {
                console.error("Error obteniendo el enlace");
            }
        };
        xhr.send();
    };

    var saveData = (function () {
        let element = document.createElement('a');
        let blob, url;
        return function (data, fileName) {
            blob = new Blob([data]),
                url = window.URL.createObjectURL(blob);
            element.setAttribute('href', url);
            element.setAttribute('download', fileName);
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            window.URL.revokeObjectURL(url);
        };
    }());

})();

