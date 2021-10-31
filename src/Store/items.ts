import { writable } from 'svelte/store';

const ITEMS = {};

const { subscribe, set, update } = writable(ITEMS);

function ensure(callback = () => {}) {
    if (Object.keys(ITEMS).length === 0) {
        fetch ("https://dev.dynulo.com/pmc/v2/items", {
            method: 'GET',
            headers: {
                "x-dynulo-guild-token": "50236e05-bc9a-4657-93d5-50cf58cba4d8",
            },
        }).then(response => {
            response.json().then(json => {
                var result = {};
                for (var i = 0; i < json.length; i++) {
                    result[json[i].class] = json[i];
                }
                set(result);
                callback();
            });
        });
    } else {
        callback();
    }
}

export default {
    subscribe,
    ensure,
}
