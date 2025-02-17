<template>
    <div id="map" class="map"></div>
    <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
    </div>
    <div id="location"></div>
</template>
<script setup>
import { toStringHDMS } from 'ol/coordinate.js';
import GeoJSON from 'ol/format/GeoJSON';
import { Tile } from 'ol/layer';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import { toLonLat } from 'ol/proj.js';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import View from 'ol/View.js';
import { onMounted } from 'vue';

/**
 * Elements that make up the popup.
 */

/**
 * Create an overlay to anchor the popup to the map.
 */

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */

// SVG Marker
const markerSVG = `
  data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' display='block' height='41px' width='27px' viewBox='0 0 27 41'%3E%3Cdefs%3E%3CradialGradient id='shadowGradient'%3E%3Cstop offset='10%25' stop-opacity='0.4'%3E%3C/stop%3E%3Cstop offset='100%25' stop-opacity='0.05'%3E%3C/stop%3E%3C/radialGradient%3E%3C/defs%3E%3Cellipse cx='13.5' cy='34.8' rx='10.5' ry='5.25' fill='url(%23shadowGradient)'%3E%3C/ellipse%3E%3Cpath fill='%23555' d='M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z'%3E%3C/path%3E%3Cpath opacity='0.25' d='M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z'%3E%3C/path%3E%3Ccircle fill='white' cx='13.5' cy='13.5' r='5.5'%3E%3C/circle%3E%3C/svg%3E `;
const markerIconUrl = markerSVG; //`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markerSVG)}`;

onMounted(() => {
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    /**

     * Create the map.
     */

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    const overlay = new Overlay({
        element: container,
        autoPan: {
            animation: {
                duration: 250
            }
        }
    });

    const map = new Map({
        layers: [
            new Tile({
                source: new OSM()
            }),

            new VectorLayer({
                source: new VectorSource({
                    format: new GeoJSON(),
                    url: '../public/demo/data/geo.json'
                }),

                style: new Style({
                    image: new Icon({
                        src: markerIconUrl,
                        scale: 1,

                        anchor: [0.1, 0.35]
                    })
                })
            })
        ],
        overlays: [overlay],
        target: 'map',
        view: new View({
            center: [0, 0],
            zoom: 2
        })
    });

    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', function (evt) {
        const coordinate = evt.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
        overlay.setPosition(coordinate);
    });
});
</script>
<style>
@import url(/node_modules/ol/ol.css);
@keyframes spinner {
    to {
        transform: rotate(360deg);
    }
}

.map {
    width: 100%;
    height: 400px;
}
.spinner:after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    margin-top: -20px;
    margin-left: -20px;
    border-radius: 50%;
    border: 5px solid rgba(180, 180, 180, 0.6);
    border-top-color: rgba(0, 0, 0, 0.6);
    animation: spinner 0.6s linear infinite;
}

.ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}
.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}
.ol-popup-closer:after {
    content: '✖';
}
</style>
