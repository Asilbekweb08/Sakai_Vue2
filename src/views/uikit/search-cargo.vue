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
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import * as olStyle from 'ol/style';
import { DragBox } from 'ol/interaction';
import { Translate } from 'ol/interaction';

const host = 'http://127.0.0.1';
const calendarValue = ref(null);
const selectedTypeBodyNodes = ref(null);
const selectedTypeBodyNode = ref(null);
const selectADRs = ref(null);
const selectADR = ref(null);
const cargos = ref();
const visible = ref(false);
const cargoView = ref(null);

const userCoordinates = ref([0, 0]);

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

function initializeMap(coordinates) {
    const map = new Map({
        target: 'mapContainer',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            new VectorLayer({
                source: new VectorSource({
                    features: [],
                }),
            }),
        ],
        view: new View({
            center: fromLonLat(coordinates),
            zoom: 10,
        }),
    });

    let vectorSource = new VectorSource();
    let marker = new Feature({
        geometry: new Point(fromLonLat(coordinates)),
    });

    marker.setStyle(
        new olStyle.Style({
            image: new olStyle.Icon({
                src: '/marker.svg',
                scale: 0.05, 
            }),
        })
    );

    vectorSource.addFeature(marker);

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    map.addLayer(vectorLayer);

    map.on('click', function (event) {
        const clickedCoordinates = event.coordinate;
        const newCoordinates = toLonLat(clickedCoordinates);

        marker.setGeometry(new Point(clickedCoordinates));
        reverseGeocode(newCoordinates);

        map.getView().setCenter(clickedCoordinates);
        map.getView().setZoom(15);
    });

    // Call loadGeoJSON to add features from GeoJSON
    loadGeoJSON(vectorSource);
}

// Function to reverse geocode the coordinates to an address
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

function subminForm(event) {
    let form = {
        filter_start_point_location: filter_start_point_location.value,
        filter_finish_point_location: filter_finish_point_location.value,
        selectedTypeBodyNode: selectedTypeBodyNode.value,
        calendarValue: calendarValue.value,
        selectADR: selectADR.value,
    };

    console.log(JSON.stringify(form));

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization',
    };

    axios
        .post(host + '/api/search/cargos', JSON.stringify(form), { headers })
        .then(function (response) {
            console.log(response.data);
            cargos.value = [];
            cargos.value = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Function to load GeoJSON and add it to the map
function loadGeoJSON(vectorSource) {
    axios.get(host + '/api/search/cargos')  // Replace with your actual GeoJSON file API endpoint
        .then(response => {
            if (response.data) {
                const geojsonFormat = new ol.format.GeoJSON();
                const features = geojsonFormat.readFeatures(response.data, {
                    featureProjection: 'EPSG:3857',  // Ensure correct map projection
                });

                features.forEach(feature => {
                    const markerStyle = new olStyle.Style({
                        image: new olStyle.Icon({
                            src: '/marker.svg',  // Marker icon
                            scale: 0.05,  // Adjust scale
                        }),
                    });
                    feature.setStyle(markerStyle);
                    vectorSource.addFeature(feature);
                });

                console.log('GeoJSON data loaded and added to map');
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
</style>
