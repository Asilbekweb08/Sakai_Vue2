<template>
    <div ref="mapContainer" class="h-96 w-full relative">
        <!-- Xaritadagi popup oynasi -->
        <div id="popup" class="absolute bg-white p-3 shadow-lg rounded-lg text-sm hidden">
            <div id="popup-content" class="font-semibold text-gray-700">
                <!-- Popup tarkibi -->
            </div>
        </div>
    </div>
</template>
<script setup>
import { defaults as defaultControls } from 'ol/control/defaults.js';
import FullScreen from 'ol/control/FullScreen.js';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import Link from 'ol/interaction/Link';
import { Tile } from 'ol/layer';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import View from 'ol/View';
import { onMounted, ref } from 'vue';

// SVG Marker
const markerSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="50px" height="50px">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 4.42 5 11 7 13 2-2 7-8.58 7-13 0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
`;
const markerIconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markerSVG)}`;

const mapContainer = ref(null);
let marker;
let vectorSource;
let map;
let overlay;
let container = document.getElementById('popup');
let closer = document.getElementById('popup-closer');

onMounted(() => {
    var layers = [
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
    ];

    // Marker yaratish
    marker = new Feature({
        geometry: new Point([0, 0])
    });

    vectorSource = new VectorSource({
        features: [marker]
    });
    map = new Map({
        controls: defaultControls().extend([new FullScreen()]),
        target: mapContainer.value,

        layers: layers,
        view: new View({
            center: [0, 0],
            zoom: 14,
            constrainResolution: true
        })
    });

    map.on('singleclick', function (e) {
        var feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
            return feature;
        });

        if (feature === marker) {
            scope.$emit('openlayers.map.markerclick', {
                data: scope.source,
                lat: scope.lat,
                lon: scope.lon
            });
        }
    });

    map.addInteraction(new Link());

    map.on('loadstart', function () {
        map.getTargetElement().classList.add('spinner');
    });
    map.on('loadend', function () {
        map.getTargetElement().classList.remove('spinner');
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource
    });

    map.addLayer(vectorLayer);

    // **Popup (Overlay) yaratish**
    const popupElement = document.createElement('div');
    popupElement.className = 'ol-popup';
    popupElement.style.position = 'absolute';
    popupElement.style.backgroundColor = 'white';
    popupElement.style.padding = '10px';
    popupElement.style.borderRadius = '5px';
    popupElement.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    popupElement.style.display = 'none';

    overlay = new Overlay({
        element: popupElement,
        offset: [0, -40], // Marker ustida popup chiqishi uchun
        positioning: 'bottom-center'
    });

    map.addOverlay(overlay);

    // Xarita bosilganda marker joylashuvi va popup ko'rsatish
    map.on('click', (event) => {
        const coordinates = event.coordinate;
        updateMarker(coordinates);
        showPopup(event.coordinate);
    });
    // Popup ko'rsatish
    function showPopup(coordinate) {
        const [lon, lat] = coordinate;
        const formattedCoords = toDMS(lat, lon);

        popupElement.innerHTML = `
        <div style="
        z-index:9999;
            display: flex; 
            align-items: center; 
            gap: 8px; 
            background: #fff; 
            color: black; 
            padding: 10px; 
            border-radius: 8px; 
            min-width: 250px; 
            max-width: 370px;
            white-space: nowrap;
        ">
            <strong>You clicked here:</strong> <span>${formattedCoords}</span>
        </div>
    `;

        popupElement.style.display = 'block';
        overlay.setPosition(coordinate);
    }
});

// Marker joylashuvini yangilash
function updateMarker(coordinates) {
    marker.setGeometry(new Point(coordinates));
    vectorSource.changed();
}

function toDMS(lat, lon) {
    const toDMSValue = (val) => {
        const deg = Math.floor(val);
        const minFloat = (val - deg) * 60;
        const min = Math.floor(minFloat);
        const sec = Math.round((minFloat - min) * 60);
        return `${deg}° ${min}' ${sec}"`;
    };

    const latDMS = toDMSValue(Math.abs(lat)) + (lat >= 0 ? ' N' : ' S');
    const lonDMS = toDMSValue(Math.abs(lon)) + (lon >= 0 ? ' E' : ' W');

    return `${latDMS}, ${lonDMS}`;
}
</script>
<style>
@import url(/node_modules/ol/ol.css);
@keyframes spinner {
    to {
        transform: rotate(360deg);
    }
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
</style>
