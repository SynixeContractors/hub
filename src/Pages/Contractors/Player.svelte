<script>
    import { onMount } from 'svelte';
    import { Row, Col, Card, CardBody } from 'sveltestrap';
    import { Jellyfish } from 'svelte-loading-spinners';
    import { ArrowLeftIcon, ArrowRightIcon } from 'svelte-feather-icons';
    import Line from "svelte-chartjs/src/Line.svelte"
    import Pie from "svelte-chartjs/src/Pie.svelte"
    import { LOADER_SIZE } from '../../loader';
    import { colors } from '../../colors';
    import { DateTime } from 'luxon';
    

    import Title from '../../Title.svelte';

    import contractors from '../../Store/contractors';
    import items from '../../Store/items';

    export let params;// = window.location.hash.replace('#/Contractors/', '').replace('#/Contractors', '').replace('%20', ' ');

    let players = [];
    let player = null;
    let timeline = [];
    let ready = false
    let balance = 0;
    let dataCategory = {};

    let dataBalance = {
        labels: [],
        datasets: [
            {
                label: 'Balance',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
            }
        ]
    };

    function byDate( a, b ) {
        if ( a.created < b.created ){
            return 1;
        }
        if ( a.created > b.created ){
            return -1;
        }
        return 0;
    }

    onMount(() => {
        items.ensure(() => {
            console.log('about to load contractor');
            contractors.ensurePlayer(params.player, (p) => {
                console.log('have contractor', p);
                player = p;
                timeline = [];
                timeline = timeline.concat(p.transactions);
                timeline = timeline.concat(p.purchases);
                timeline = timeline.sort(byDate);
                balance = 0;
                let playerBalance = 0;
                let categories = {};
                p.transactions.forEach(t => {
                    if (t.player == params.player) {
                        balance += t.amount;
                    } else {
                        balance -= t.amount;
                        if ('salaries' in categories) {
                            categories['salaries'] += t.amount;
                        } else {
                            categories['salaries'] = t.amount;
                        }
                    }
                });
                p.purchases.forEach(t => {
                    if (!t.global) {
                        balance -= t.amount * t.quantity;
                        const category = $items[t.class].categories;
                        if (category in categories) {
                            categories[category] += t.amount * t.quantity;
                        } else {
                            categories[category] = t.amount * t.quantity;
                        }
                    } else if (params.player == 0) {
                        balance -= t.amount * t.quantity;
                        const category = $items[t.class].categories;
                        if (category in categories) {
                            categories[category] += t.amount * t.quantity;
                        } else {
                            categories[category] = t.amount * t.quantity;
                        }
                    }
                });
                timeline.reverse();
                timeline.forEach(t => {
                    if (!t.global) {
                        dataBalance.labels.push(t.created);
                        if (t.quantity) {
                            playerBalance -= t.amount * t.quantity;
                        } else {
                            if (t.player == params.player) {
                                playerBalance += t.amount;
                            } else {
                                playerBalance -= t.amount;
                            }
                        }
                        dataBalance.datasets[0].data.push(playerBalance);
                    }
                    t.created = DateTime.fromISO(t.created + 'Z').toLocaleString(DateTime.DATETIME_FULL);
                });
                timeline.reverse();
                setTimeout(() => {
                    let cat = Object.entries(categories);
                    cat = cat.sort(function(a, b) {
                        return b[0] - a[0];
                    });
                    dataCategory = {
                        labels: cat.map((i) => i[0]),
                        datasets: [{
                            data: cat.map((i) => i[1]),
                            backgroundColor: cat.map((i) => colors[i[0]]),
                        }]
                    };
                    ready = true;
                }, 5);
            }, (ps) => {
                players = ps;
            });
        });
    });

    function name(player) {
        if (players.length > 0) {
            let p = players.find(p => p.player == player);
            if (p) {
                return p.nickname;
            }
        }
    }

</script>

{ #if !ready }
    <Row class="justify-content-center jellyfish">
        <Jellyfish size={LOADER_SIZE} color="var(--bs-primary)" unit="px" duration="1s" />
    </Row>
{ :else }
    { #if player.player == 0 }
    <Title>Synixe Contractors</Title>
    { :else }
    <Title>Contractor <strong>{player.nickname}</strong></Title>
    { /if }
    <h3>Current Balance ${balance}</h3>
    <Row style="padding-bottom: 1rem">
        <Col md="8" sm="12" style="position: relative;height: 20rem">
            <Line data={dataBalance} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false, scales: { x: { display: false } } }} />
        </Col>
        <Col md="4" sm="12">
            <Pie data={dataCategory}  options={{ plugins: { legend: { display: false } }, responsive: true}} />
        </Col>
    </Row>
    <Row>
        { #each timeline as event }
            <Card>
                <CardBody>
                    { #if player.player == '0' }
                        { #if event.class }
                            <span style="color: red"><ArrowRightIcon /></span> <div style="width: 5rem; display: inline-block">${ event.amount * event.quantity }</div> <div style="width: 10rem; display: inline-block">{ name(event.player) }</div> {event.quantity} x <b>{ $items[event.class].pretty }</b> @ ${ event.amount }
                        { :else }
                            { #if event.player == '0' }
                                <span style="color: green"><ArrowLeftIcon /></span> <div style="width: 5rem; display: inline-block">${ event.amount }</div> { event.reason }
                            { :else }
                                <span style="color: blue"><ArrowRightIcon /></span> <div style="width: 5rem; display: inline-block">${ event.amount }</div> <div style="width: 10rem; display: inline-block">{ name(event.player) }</div> { event.reason }
                            { /if }
                        { /if }
                        <span style="float: right">
                            { event.created }
                        </span>
                    { :else }
                        { #if event.class }
                            <span style="color: red"><ArrowRightIcon /></span> <div style="width: 5rem; display: inline-block">${ event.amount * event.quantity }</div> {event.quantity} x <b>{ $items[event.class].pretty }</b> @ ${ event.amount }
                        { :else }
                        <span style="color: green"><ArrowLeftIcon /></span> <div style="width: 5rem; display: inline-block">${ event.amount }</div> { event.reason }
                        { /if }
                        <span style="float: right">
                            { event.created }
                        </span>
                    { /if }
                </CardBody>
            </Card>
        { /each }
    </Row>
{ /if }
