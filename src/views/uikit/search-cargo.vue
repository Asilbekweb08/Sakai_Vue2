<script setup>
import { filter_finish_point_location, filter_finish_point_search, filter_finish_point_suggestions, filter_start_point_location, filter_start_point_search, filter_start_point_suggestions } from '@/service/FromToService';
import { NodeService } from '@/service/NodeService';
import axios from 'axios';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import { onMounted, ref } from 'vue';
import * as ol from 'ol';
import 'ol/ol.css';
import Overlay from 'ol/Overlay';
import { Style, Icon } from 'ol/style';  // Style va Icon import qilish
import GeoJSON from 'ol/format/GeoJSON';  // GeoJSON formatini OpenLayersdan import qilish
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import * as olStyle from 'ol/style';

const host = 'http://127.0.0.1';
const calendarValue = ref(null);
const selectedTypeBodyNodes = ref(null);
const selectedTypeBodyNode = ref(null);
const selectADRs = ref(null);
const selectADR = ref(null);
const cargos = ref();
const visible = ref(false);
const cargoView = ref(null);
let popup = ref(null);
const userCoordinates = ref([0, 0]);
let map = ref(null);  // xarita obyekti uchun o'zgaruvchi
let vectorSource = ref(null);  // vectorSource ni global o'zgaruvchi sifatida aniqlash

onMounted(() => {
    NodeService.getTypeBodyNodes().then((data) => (selectedTypeBodyNodes.value = data));
    NodeService.getADRNodes().then((data) => (selectADRs.value = data));

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userCoordinates.value = [position.coords.longitude, position.coords.latitude];
                initializeMap(userCoordinates.value);
            },
            (error) => {
                console.error("Error getting geolocation", error);
            }
        );
    }
});

// Xaritani boshlash

function initializeMap(coordinates) {
    vectorSource.value = new VectorSource();
    popup.value = new Overlay({
        element: document.getElementById('popup'),
        positioning: 'bottom-center',
        stopEvent: false,
    });
    
    map.value = new Map({
        target: 'mapContainer',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            new VectorLayer({
                source: vectorSource.value,
            }),
        ],
        overlays: [popup.value],
        view: new View({
            center: fromLonLat(coordinates),
            zoom: 10,
        }),
    });

    loadGeoJSON(vectorSource.value, map.value);

    map.value.on('click', (event) => {
        const feature = map.value.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        if (feature) {
            const properties = feature.getProperties();
            const coordinates = feature.getGeometry().getCoordinates();
            const popupContent = `<b>${properties.title || 'No Title'}</b><br>${properties.desc || 'No Description'}`;
            const popupElement = document.getElementById('popup-content');
            if (popupElement) {
                popupElement.innerHTML = popupContent;
                popup.value.setPosition(coordinates);
            }
        } else {
            popup.value.setPosition(undefined);
        }
    });
}

// Reverse geocoding the coordinates
function reverseGeocode(coordinates) {
    axios
        .get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[1]}&lon=${coordinates[0]}`)
        .then((response) => {
            if (response.data && response.data.display_name) {
                filter_start_point_location.value = response.data.display_name;
            }
        })
        .catch((error) => {
            console.error("Error getting address:", error);
        });
}

// Function to submit form data
function subminForm(event) {
    let form = {
        filter_start_point_location: filter_start_point_location.value,
        filter_finish_point_location: filter_finish_point_location.value,
        selectedTypeBodyNode: selectedTypeBodyNode.value,
        calendarValue: calendarValue.value,
        selectADR: selectADR.value,
        user_coordinates: userCoordinates.value,
    };

    console.log('Form ma\'lumotlari:', JSON.stringify(form));

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    axios
        .post("/public/demo/data/geo.json", JSON.stringify(form), { headers })
        .then(function (response) {
            console.log(response.data);
            cargos.value = [];
            cargos.value = response.data;

            // **GeoJSON'dan yangi ma'lumotlarni yuklash va xaritani yangilash**
            loadGeoJSON(vectorSource.value, map.value);
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Function to load GeoJSON data and add it to map
function loadGeoJSON(vectorSource, map) {
    axios.get('/public/demo/data/geo.json')
        .then(response => {
            if (response.data) {
                const geojsonFormat = new GeoJSON();
                const features = geojsonFormat.readFeatures(response.data, {
                    featureProjection: 'EPSG:3857',
                });
                
                vectorSource.clear();
                
                features.forEach(feature => {
                    const markerStyle = new Style({
                        image: new Icon({
                            src: '/marker.svg',
                            scale: 0.04,
                        }),
                    });
                    feature.setStyle(markerStyle);
                    vectorSource.addFeature(feature);
                });
            }
        })
        .catch(error => {
            console.error("Error loading GeoJSON:", error);
        });
}
</script>






<template>
    <Fluid>
      <div class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
          <div class="font-semibold text-xl">Поиск грузов</div>
          <div class="flex flex-col md:flex-row gap-4">
            <div id="mapContainer" style="height: 400px; width: 100%"></div>
            <div id="popup" class="ol-popup">
    <div id="popup-content"></div>
</div>
          </div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap gap-2 w-full">
    <label for="filter_start_point_location">Откуда</label>
    <AutoComplete
      required
      :delay="700"
      :forceSelection="true"
      v-model="filter_start_point_location"
      optionLabel="label"
      :suggestions="filter_start_point_suggestions"
      @complete="filter_start_point_search($event)"
      placeholder="Введите название населенного пункта"
      class="w-full"
      emptySearchMessage="Ничего не найдено."
      @option-select="subminForm"
    />
  </div>
            <div class="flex flex-wrap gap-2 w-full">
              <label for="filter_finish_point_location">Куда</label>
              <AutoComplete
                :delay="700"
                :forceSelection="true"
                v-model="filter_finish_point_location"
                optionLabel="label"
                :suggestions="filter_finish_point_suggestions"
                @complete="filter_finish_point_search($event)"
                placeholder="Введите название населенного пункта"
                class="w-full"
                emptySearchMessage="Ничего не найдено."
                @option-select="subminForm"
              />
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap gap-2 w-full">
              <label for="state">Тип кузова</label>
              <TreeSelect
                @change="subminForm"
                v-model="selectedTypeBodyNode"
                :options="selectedTypeBodyNodes"
                selectionMode="checkbox"
                placeholder="Выбрать"
                class="w-full"
              ></TreeSelect>
            </div>
            <div class="flex flex-wrap gap-2 w-full">
              <label for="calendarValue">Даты погрузки</label>
              <DatePicker
                @date-select="subminForm"
                :showIcon="true"
                selectionMode="range"
                dateFormat="dd.mm.yy"
                placeholder="Когда?"
                :manualInput="false"
                :showButtonBar="true"
                class="w-full"
                v-model="calendarValue"
              ></DatePicker>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap gap-2 w-full">
              <label for="lastname2">Опасный груз</label>
              <MultiSelect
                @change="subminForm"
                v-model="selectADR"
                :options="selectADRs"
                optionLabel="name"
                placeholder="ADR?"
                :filter="false"
                :showToggleAll="false"
                class="w-full"
              ></MultiSelect>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap gap-2 w-full">
              <Button
                icon="pi pi-search"
                @click="subminForm"
                label="Поиск"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
          <DataTable
            v-on:row-click="cargoOpenDetals"
            selectionMode="single"
            stripedRows
            :value="cargos"
            paginator
            :rows="5"
            sortMode="multiple"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
          >
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xl font-bold">Список грузов</span>
                <Button
                  icon="pi pi-refresh"
                  @click="subminForm"
                  rounded
                  raised
                />
              </div>
            </template>
            <Column field="id" header="Код" sortable> </Column>
            <Column field="inputCargoName" header="Наименование груза" sortable></Column>
  
            <template #footer> Всего найдено {{ cargos ? cargos.length : 0 }} грузов. </template>
          </DataTable>
        </div>
      </div>
  
      <Dialog
        v-model:visible="visible"
        maximizable
        modal
        header="Header"
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <p class="m-0">
          {{ cargoView }}
        </p>
      </Dialog>
    </Fluid>
  </template>
  

<style scoped>
#mapContainer {
    height: 400px;
    width: 100%;
}
.ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    min-width: 150px;
    max-width: 250px;
    text-align: center;
    font-size: 14px;
    color: #333;
}

.ol-popup:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: white transparent transparent transparent;
}

.ol-popup-content {
    margin: 0;
    padding: 5px;
}

</style>