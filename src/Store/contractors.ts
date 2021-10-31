import { writable } from 'svelte/store';

const CONTRACTORS = [];
const { subscribe, set, update } = writable(CONTRACTORS);

let cacheClear = null;

function isCached(): boolean {
    return CONTRACTORS.length != 0;
}

function compare( a, b ) {
    if ( a.nickname < b.nickname ){
        return -1;
    }
    if ( a.nickname > b.nickname ){
        return 1;
    }
    return 0;
}

function ensure(callback = (players: Object[]) => {}) {
    if (cacheClear) {
        clearTimeout(cacheClear);
    }
    if (CONTRACTORS.length == 0) {
        fetch ("https://dev.dynulo.com/pmc/v2/players", {
            method: 'GET',
            headers: {
                "x-dynulo-guild-token": "50236e05-bc9a-4657-93d5-50cf58cba4d8",
            },
        }).then(response => {
            response.text().then(text => {
                let json = JSON.parse(text.replace(/("[^"]*"\s*:\s*)(\d{16,})/g, '$1"$2"'));
                json.sort(compare);
                json.push({
                    "player": "0",
                    "nickname": "Synixe Contractors",
                    "hidden": false,
                    "created": "2020-01-01T00:00:00.000Z",
                });
                set(json);
                callback(json);
            });
        });
    }
}

function ensurePlayer(id: String, callback = (player: Object) => {}, playersCallback = (players: Object[]) => {}) {
    ensure((players) => {
        playersCallback(players);
    });
    let unsub = subscribe(contractors => {
        console.log('loading player', id);
        const player = contractors.find(p => p.player == id);
        if (!player) { return }
        if (!player.transactions) {
            fetch("https://dev.dynulo.com/pmc/v2/bank/transactions" + ((id == '0') ? '' : '/' + id), {
                method: 'GET',
                headers: {
                    "x-dynulo-guild-token": "50236e05-bc9a-4657-93d5-50cf58cba4d8",
                },
            }).then(response => {
                return response.json()
            }).then(json => {
                player.transactions = json;
                return fetch("https://dev.dynulo.com/pmc/v2/players/" + id + "/purchases", {
                    method: 'GET',
                    headers: {
                        "x-dynulo-guild-token": "50236e05-bc9a-4657-93d5-50cf58cba4d8",
                    },
                })
            }).then(response => {
                return response.json()
            }).then(json => {
                player.purchases = json;
                return fetch("https://dev.dynulo.com/pmc/v2/players/" + id + "/variables", {
                    method: 'GET',
                    headers: {
                        "x-dynulo-guild-token": "50236e05-bc9a-4657-93d5-50cf58cba4d8",
                    },
                })
            }).then(response => {
                return response.json()
            }).then(json => {
                player.variables = json;
                contractors[contractors.indexOf(player)] = player;
                callback(player);
            });
            // set(contractors);
        }
    });
    setTimeout(() => {
        unsub();
    }, 10000);
}

function discard() {
    cacheClear = setTimeout(function() {
        console.log('discarding');
        set([]);
    }, 5000);
}

export default {
    subscribe,
    ensure,
    ensurePlayer,
    isCached,
    discard,
}
