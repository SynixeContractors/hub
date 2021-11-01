import { writable } from 'svelte/store';

const ITEMS = {};
let FETCHING = false;

const { subscribe, set, update } = writable(ITEMS);

function ensure(callback = () => {}) {
    if (Object.keys(ITEMS).length === 0) {
        if (!FETCHING) {
            FETCHING = true;
            fetch ('https://dev.dynulo.com/pmc/v2/items', {
                method: 'GET',
                headers: {
                    'x-dynulo-guild-token': '50236e05-bc9a-4657-93d5-50cf58cba4d8',
                },
            }).then(response => {
                response.json().then(json => {
                    var result = {};
                    for (var i = 0; i < json.length; i++) {
                        result[json[i].class] = json[i];
                    }
                    FETCHING = false;
                    set(result);
                    callback();
                });
            });
        } else {
            console.log('already fetching, creating timeout');
            defer(callback);
        }
    } else {
        callback();
    }
}

function defer(callback) {
    console.log('creating defer');
    setTimeout(() => {
        if (Object.keys(ITEMS).length === 0) {
            console.log('items timeout done');
            callback();
        } else {
            defer(callback);
        }
    }, 10);
}

export default {
    subscribe,
    ensure,
}
