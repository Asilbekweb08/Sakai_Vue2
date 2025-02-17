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
const markerSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M12 2a7.008 7.008 0 0 0-7 7c0 5.353 6.036 11.45 6.293 11.707l.707.707.707-.707C12.964 20.45 19 14.353 19 9a7.008 7.008 0 0 0-7-7zm0 16.533C10.471 16.825 7 12.553 7 9a5 5 0 0 1 10 0c0 3.546-3.473 7.823-5 9.533z'/%3E%3Cpath d='M12 6a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1z'/%3E%3C/svg%3E`;

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
    if (userCoordinates.value[0] === 0 || userCoordinates.value[1] === 0) {
        console.error("Не удалось получить координаты пользователя.");
        return;
    }

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
    if (userCoordinates.value[0] === 0 || userCoordinates.value[1] === 0) {
        console.error("Не удалось получить координаты пользователя.");
    } else {
        getCargoData(); // Отправляется новый запрос при отправке формы
    }
};
</script>



<template>
    <Fluid>
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Поиск грузов</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <!-- OpenLayers карта -->
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
                            @option-select="submitForm" 
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
                            @option-select="submitForm" 
                        />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="state">Тип кузова</label>
                        <TreeSelect @change="submitForm" v-model="selectedTypeBodyNode" :options="selectedTypeBodyNodes" selectionMode="checkbox" placeholder="Выбрать" class="w-full"></TreeSelect>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="calendarValue">Даты погрузки</label>
                        <DatePicker @date-select="submitForm" :showIcon="true" selectionMode="range" dateFormat="dd.mm.yy" placeholder="Когда?" :manualInput="false" :showButtonBar="true" class="w-full" v-model="calendarValue"></DatePicker>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Опасный груз</label>
                        <MultiSelect @change="submitForm" v-model="selectADR" :options="selectADRs" optionLabel="name" placeholder="ADR?" :filter="false" :showToggleAll="false" class="w-full"></MultiSelect>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <Button icon="pi pi-search" @click="submitForm" label="Поиск" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <DataTable v-on:row-click="cargoOpenDetals" selectionMode="single" stripedRows :value="cargos" paginator :rows="5" sortMode="multiple" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                    <template #header>
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <span class="text-xl font-bold">Список грузов</span>
                            <Button icon="pi pi-refresh" @click="submitForm" rounded raised />
                        </div>
                    </template>
                    <Column field="id" header="Код" sortable> </Column>
                    <Column field="inputCargoName" header="Наименование груза" sortable></Column>

                    <template #footer> Всего найдено {{ cargos ? cargos.length : 0 }} грузов. </template>
                </DataTable>
            </div>
        </div>

        <Dialog v-model:visible="visible" maximizable modal header="Детали груза" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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
