<script setup>
import { filter_finish_point_location, filter_start_point_location } from '@/service/FromToService';
import { NodeService } from '@/service/NodeService';
import axios from 'axios';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import { onMounted, ref } from 'vue';

const calendarValue = ref(null);
const inputNumberFreeTonnage = ref(null);
const inputNumberFreeVolume = ref(null);

const selectCarSategorys = ref(null);
const selectCarSategory = ref(null);

const selectedTypeBodyNodes = ref(null);
const selectedTypeBodyNode = ref(null);

const selectADRs = ref(null);
const selectADR = ref(null);

const visible = ref(false);

const truckView = ref(null);
const trucks = ref();

const accessToken = ref('');
const userId = ref('');
const message = ref('');

if (localStorage.getItem('accessToken')) {
    accessToken.value = localStorage.getItem('accessToken');
}

if (localStorage.getItem('userId')) {
    userId.value = localStorage.getItem('userId');
}

subminForm();

const host = 'http://127.0.01';

onMounted(() => {
    NodeService.getTypeBodyNodes().then((data) => (selectedTypeBodyNodes.value = data));
    NodeService.getADRNodes().then((data) => (selectADRs.value = data));
    NodeService.getCarSategory().then((data) => (selectCarSategorys.value = data));
});

function truckOpenDetals(event) {
    console.log(event.data.id);
    visible.value = true;
    //window.location.replace('/uikit/cargo/?id=' + event.data.id);
    truckView.value = event.data.id;
}

function subminForm(event) {
    let form = {
        accessToken: accessToken.value,
        userId: userId.value,
        filter_start_point_location: filter_start_point_location.value,
        filter_finish_point_location: filter_finish_point_location.value,
        selectedTypeBodyNode: selectedTypeBodyNode.value,
        calendarValue: calendarValue.value,
        selectADR: selectADR.value
    };

    console.log(JSON.stringify(form));

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
    };
    axios
        .post(host + '/api/search/trucks', JSON.stringify(form), { mode: 'no-cors' }, { headers })
        .then(function (response) {
            console.log(response.data);
            trucks.value = [];
            trucks.value = response.data;
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
                <DataTable v-on:row-click="truckOpenDetals" selectionMode="single" stripedRows :value="trucks" paginator :rows="5" sortMode="multiple" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                    <template #header>
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <span class="text-xl font-bold">Мой транспорт</span>
                            <Button icon="pi pi-refresh" @click="subminForm" rounded raised />
                        </div>
                    </template>
                    <Column field="id" header="Код" sortable> </Column>

                    <template #footer> Всего найдено {{ trucks ? trucks.length : 0 }} грузов. </template>
                </DataTable>
            </div>
        </div>

        <Dialog v-model:visible="visible" maximizable modal header="Header" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p class="m-0">
                {{ truckView }}
            </p>
        </Dialog>
    </Fluid>
</template>
