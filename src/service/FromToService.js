import axios from 'axios';
import { ref } from 'vue';

const filter_start_point_location = ref();
const filter_start_point_suggestions = ref([]);

const filter_finish_point_location = ref();
const filter_finish_point_suggestions = ref([]);
const host = 'http://127.0.01';
let timer;

const filter_start_point_search = (event) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        if (filter_start_point_location.value.length > 1) {
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
            };
            axios
                .get(host + '/api/suggest/address?keyword=' + filter_start_point_location.value, { mode: 'no-cors' }, { headers })
                .then((response) => {
                    let res = response.data;

                    filter_start_point_suggestions.value = [];
                    for (let i = 0; i < res.length; i++) {
                        filter_start_point_suggestions.value.push({
                            code: res[i].coordinates[1] + ',' + res[i].coordinates[0],
                            label: res[i].properties.display_name
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    filter_start_point_suggestions.value = [];
                });
        }
    }, 400);
    return filter_start_point_suggestions;
};

const filter_finish_point_search = (event) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        if (filter_finish_point_location.value.length > 1) {
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
            };
            axios
                .get(host + '/api/suggest/address?keyword=' + filter_finish_point_location.value, { mode: 'no-cors' }, { headers })
                .then((response) => {
                    let res = response.data;

                    filter_finish_point_suggestions.value = [];
                    for (let i = 0; i < res.length; i++) {
                        filter_finish_point_suggestions.value.push({
                            code: res[i].coordinates[1] + ',' + res[i].coordinates[0],
                            label: res[i].properties.display_name
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    filter_finish_point_suggestions.value = [];
                });
        }
    }, 400);
    return filter_finish_point_suggestions;
};

export { filter_finish_point_location, filter_finish_point_search, filter_finish_point_suggestions, filter_start_point_location, filter_start_point_search, filter_start_point_suggestions };
