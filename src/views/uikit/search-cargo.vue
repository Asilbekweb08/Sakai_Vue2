<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import * as ol from 'ol';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import * as olStyle from 'ol/style';

const cargos = ref([]);
const mapRef = ref(null);
const markerSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' display='block' height='41px' width='27px' viewBox='0 0 27 41'%3E%3Cpath fill='%23555' d='M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z'%3E%3C/path%3E%3Cpath opacity='0.25' d='M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z'%3E%3C/path%3E%3Ccircle fill='white' cx='13.5' cy='13.5' r='5.5'%3E%3C/circle%3E%3C/svg%3E`;

const userCoordinates = ref([0, 0]); // Координаты пользователя

// Получение геолокации
onMounted(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userCoordinates.value = [position.coords.longitude, position.coords.latitude];
                console.log("Координаты пользователя:", userCoordinates.value);
                initializeMap(userCoordinates.value);
            },
            (error) => {
                console.error("Ошибка геолокации:", error);
            }
        );
    } else {
        console.error("Геолокация не поддерживается.");
    }
});

// Инициализация карты
function initializeMap(coordinates) {
    console.log("Создание карты...");
    const map = new Map({
        target: mapRef.value,
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

    // Создание маркера
    const marker = new Feature({
        geometry: new Point(fromLonLat(coordinates)),
    });

    const vectorSource = new VectorSource({
        features: [marker],
    });

    // Добавление стиля для маркера
    marker.setStyle(
        new olStyle.Style({
            image: new olStyle.Icon({
                src: markerSVG,
                scale: 0.1,
            }),
        })
    );

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    map.addLayer(vectorLayer);
}

// Получение данных о грузах через API
const getCargoData = async () => {
    const form = {
        user_coordinates: userCoordinates.value,
    };

    console.log("Отправка запроса к API:", form);
    try {
        const response = await axios.post('/api/search/cargos', form);
        console.log("Ответ от API:", response.data);
        if (response.data && Array.isArray(response.data)) {
            cargos.value = response.data;
            updateMapWithCargos(response.data);
        } else {
            console.error("Неверные данные:", response.data);
        }
    } catch (error) {
        console.error("Ошибка API:", error);
    }
};

// Отображение данных о грузах на карте
function updateMapWithCargos(data) {
    console.log("Отображение данных о грузах на карте...", data);
    const vectorSource = new VectorSource();
    data.forEach((cargo) => {
        const marker = new Feature({
            geometry: new Point(fromLonLat([cargo.longitude, cargo.latitude])),
            cargoData: cargo,
        });

        marker.setStyle(
            new olStyle.Style({
                image: new olStyle.Icon({
                    src: markerSVG,
                    scale: 0.1,
                }),
            })
        );

        vectorSource.addFeature(marker);
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    const map = new Map({
        target: mapRef.value,
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            vectorLayer,
        ],
        view: new View({
            center: fromLonLat(userCoordinates.value),
            zoom: 10,
        }),
    });

    // Показать popup при клике на маркер
    vectorLayer.on('click', (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        if (feature) {
            const cargo = feature.get('cargoData');
            alert(`Cargo ID: ${cargo.id}\nОписание: ${cargo.description}`);
        }
    });
};

// Отправка формы и обновление данных о грузах
const submitForm = () => {
    console.log("Форма отправлена.");
    getCargoData(); // Отправляется новый запрос при отправке формы
};
</script>

<template>
    <Fluid>
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Поиск грузов</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <!-- OpenLayers xaritasi -->
                    <div ref="mapRef" style="height: 400px; width: 100%"></div>
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
                        <TreeSelect @change="subminForm" v-model="selectedTypeBodyNode" :options="selectedTypeBodyNodes" selectionMode="checkbox" placeholder="Выбрать" class="w-full"></TreeSelect>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="calendarValue">Даты погрузки</label>
                        <DatePicker @date-select="subminForm" :showIcon="true" selectionMode="range" dateFormat="dd.mm.yy" placeholder="Когда?" :manualInput="false" :showButtonBar="true" class="w-full" v-model="calendarValue"></DatePicker>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Опасный груз</label>
                        <MultiSelect @change="subminForm" v-model="selectADR" :options="selectADRs" optionLabel="name" placeholder="ADR?" :filter="false" :showToggleAll="false" class="w-full"></MultiSelect>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full"><Button icon="pi pi-search" @click="subminForm" label="Поиск" /></div>
                </div>
            </div>
        </div>
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <DataTable v-on:row-click="cargoOpenDetals" selectionMode="single" stripedRows :value="cargos" paginator :rows="5" sortMode="multiple" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                    <template #header>
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <span class="text-xl font-bold">Список грузов</span>
                            <Button icon="pi pi-refresh" @click="subminForm" rounded raised />
                        </div>
                    </template>
                    <Column field="id" header="Код" sortable> </Column>
                    <Column field="inputCargoName" header="Наименование груза" sortable></Column>

                    <template #footer> Всего найдено {{ cargos ? cargos.length : 0 }} грузов. </template>
                </DataTable>
            </div>
        </div>

        <Dialog v-model:visible="visible" maximizable modal header="Header" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p class="m-0">
                {{ cargoView }}
            </p>
        </Dialog>
    </Fluid>
</template>


<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
