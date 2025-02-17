<script setup>
import { filter_finish_point_location, filter_finish_point_search, filter_finish_point_suggestions, filter_start_point_location, filter_start_point_search, filter_start_point_suggestions } from '@/service/FromToService';
import { NodeService } from '@/service/NodeService';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const comment = ref(null);
const calendarValue = ref(null);
const inputNumberFreeTonnage = ref(null);
const inputNumberFreeVolume = ref(null);
const inputLength = ref(null);
const inputWidth = ref(null);
const inputHeight = ref(null);

const selectCarSategorys = ref(null);
const selectCarSategory = ref(null);

const selectedTypeBodyNodes = ref(null);
const selectedTypeBodyNode = ref(null);

const selectCargoTypes = ref(null);
const selectCargoType = ref(null);

const selectTypeTransportation = ref(null);
const selectTypeTransportations = ref(null);

const selectADRs = ref(null);
const selectADR = ref(null);

const accessToken = ref('');
const userId = ref('');
const message = ref('');

if (localStorage.getItem('accessToken')) {
    accessToken.value = localStorage.getItem('accessToken');
}

if (localStorage.getItem('userId')) {
    userId.value = localStorage.getItem('userId');
}

onMounted(() => {
    NodeService.getTypeBodyNodes().then((data) => (selectedTypeBodyNodes.value = data));
    NodeService.getADRNodes().then((data) => (selectADRs.value = data));
    NodeService.getCarSategory().then((data) => (selectCarSategorys.value = data));
    NodeService.getCargoType().then((data) => (selectCargoTypes.value = data));
    NodeService.getTypeTransportation().then((data) => (selectTypeTransportations.value = data));
});

const host = 'http://127.0.01';

function subminForm(event) {
    let form = {
        accessToken: accessToken.value,
        userId: userId.value,
        filter_start_point_location: filter_start_point_location.value,
        filter_finish_point_location: filter_finish_point_location.value,
        selectCarSategory: selectCarSategory.value,
        selectedTypeBodyNode: selectedTypeBodyNode.value,
        calendarValue: calendarValue.value,
        inputNumberFreeTonnage: inputNumberFreeTonnage.value,
        inputNumberFreeVolume: inputNumberFreeVolume.value,
        selectADR: selectADR.value,
        inputLength: inputLength.value,
        inputWidth: inputWidth.value,
        inputHeight: inputHeight.value,
        selectTypeTransportation: selectTypeTransportation.value,
        comment: comment.value
    };

    console.log(JSON.stringify(form));

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
    };
    axios
        .post(host + '/api/create/truck', JSON.stringify(form), { mode: 'no-cors' }, { headers })
        .then(function (response) {
            message.value = response.data;
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
</script>

<template>
    <Fluid>
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <h1 class="text-2xl font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">Добавить транспорт</h1>
                <hr role="presentation" class="my-10 mt-6 w-full border-t border-zinc-950/10 dark:border-white/10" />

                <InputText v-model="accessToken" type="hedden" />
                <InputText v-model="userId" type="hedden" />

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="filter_start_point_location">Откуда вы готовы взять груз</label>

                        <AutoComplete
                            :delay="700"
                            :forceSelection="true"
                            v-model="filter_start_point_location"
                            optionLabel="label"
                            :suggestions="filter_start_point_suggestions"
                            @complete="filter_start_point_search($event)"
                            placeholder="Введите название населенного пункта"
                            class="w-full"
                            emptySearchMessage="Ничего не найдено."
                        />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="filter_finish_point_location">Куда готовы ехать</label>
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
                        />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="selectCarSategory">Категория авто</label>
                        <MultiSelect v-model="selectCarSategory" :options="selectCarSategorys" optionLabel="name" placeholder="Фура?" :filter="false" :showToggleAll="false" class="w-full"></MultiSelect>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="selectedTypeBodyNode">Тип кузова</label>
                        <TreeSelect v-model="selectedTypeBodyNode" :options="selectedTypeBodyNodes" selectionMode="checkbox" placeholder="Выбрать" class="w-full"></TreeSelect>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="calendarValue">Даты погрузки</label>
                        <DatePicker :showIcon="true" id="calendarValue" selectionMode="range" dateFormat="dd.mm.yy" placeholder="Когда?" :manualInput="false" :showButtonBar="true" class="w-full" v-model="calendarValue"></DatePicker>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="inputNumberFreeTonnage">Вес</label>
                        <InputNumber v-model="inputNumberFreeTonnage" :min="0" :max="100" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :step="1" suffix=" тонн." mode="decimal" fluid>
                            <template #incrementbuttonicon>
                                <span class="pi pi-plus" />
                            </template>
                            <template #decrementbuttonicon>
                                <span class="pi pi-minus" />
                            </template>
                        </InputNumber>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="inputNumberFreeVolume">Объем</label>
                        <InputNumber v-model="inputNumberFreeVolume" :min="0" :max="200" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :step="1" suffix=" м³" mode="decimal" fluid>
                            <template #incrementbuttonicon>
                                <span class="pi pi-plus" />
                            </template>
                            <template #decrementbuttonicon>
                                <span class="pi pi-minus" />
                            </template>
                        </InputNumber>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="selectADR">Опасный груз</label>
                        <MultiSelect v-model="selectADR" :options="selectADRs" optionLabel="name" placeholder="ADR?" :filter="false" :showToggleAll="false" class="w-full"></MultiSelect>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="inputLength">Длина</label>
                        <InputNumber v-model="inputLength" :min="0" :max="100" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :step="1" suffix=" м." mode="decimal" fluid>
                            <template #incrementbuttonicon>
                                <span class="pi pi-plus" />
                            </template>
                            <template #decrementbuttonicon>
                                <span class="pi pi-minus" />
                            </template>
                        </InputNumber>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="inputWidth">Ширина</label>
                        <InputNumber v-model="inputWidth" :min="0" :max="200" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :step="1" suffix=" м." mode="decimal" fluid>
                            <template #incrementbuttonicon>
                                <span class="pi pi-plus" />
                            </template>
                            <template #decrementbuttonicon>
                                <span class="pi pi-minus" />
                            </template>
                        </InputNumber>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="inputHeight">Высота</label>

                        <InputNumber v-model="inputHeight" :min="0" :max="200" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :step="1" suffix=" м." mode="decimal" fluid>
                            <template #incrementbuttonicon>
                                <span class="pi pi-plus" />
                            </template>
                            <template #decrementbuttonicon>
                                <span class="pi pi-minus" />
                            </template>
                        </InputNumber>
                    </div>
                </div>
                <h1 class="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">Требования к транспортировке</h1>
                <hr role="presentation" class="my-10 mt-6 w-full border-t border-zinc-950/10 dark:border-white/10" />
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="selectTypeTransportation">Тип перевозки</label>

                        <Select v-model="selectTypeTransportation" :options="selectTypeTransportations" filter optionLabel="name" placeholder="Указать" class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="comment">Примечание</label>

                        <Textarea placeholder="Что стоит знать заказчику?" v-model="comment" :autoResize="true" rows="3" cols="30" />
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full"><Button icon="pi pi-check" @click="subminForm" label="Сохранить" /></div>
                </div>
                <Message class="mt-0 mb-4" v-if="message.status == 'ERROR'" severity="error">{{ message.messages }}</Message>
                <Message class="mt-0 mb-4" v-if="message.status == 'OK'" severity="success">{{ message.messages }}</Message>
            </div>
        </div>
    </Fluid>
</template>
