<script>
    import { onMount } from 'svelte';
    import { Row, Card, CardBody } from 'sveltestrap';
    import { Jellyfish } from 'svelte-loading-spinners';
    import { ArrowLeftIcon, ArrowRightIcon } from 'svelte-feather-icons';
    import Line from "svelte-chartjs/src/Line.svelte"

    import Title from '../../Title.svelte';

    import contractors from '../../Store/contractors';
    import items from '../../Store/items';

    export let params;// = window.location.hash.replace('#/Contractors/', '').replace('#/Contractors', '').replace('%20', ' ');

    let players = [];
    let player = null;
    let timeline = [];
    let ready = false
    let balance = 0;

    let dataLine = {
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
        contractors.ensurePlayer(params.player, (p) => {
            player = p;
            timeline = [];
            timeline = timeline.concat(p.transactions);
            timeline = timeline.concat(p.purchases);
            timeline = timeline.sort(byDate);
            balance = 0;
            let dataBalance = 0;
            p.transactions.forEach(t => {
                if (t.player == params.player) {
                    balance += t.amount;
                } else {
                    balance -= t.amount;
                }
            });
            p.purchases.forEach(t => {
                if (!t.global) {
                    balance -= t.amount * t.quantity;
                }
            });
            timeline.reverse();
            timeline.forEach(t => {
                if (!t.global) {
                    dataLine.labels.push(t.created);
                    if (t.quantity) {
                        dataBalance -= t.amount * t.quantity;
                    } else {
                        if (t.player == params.player) {
                            dataBalance += t.amount;
                        } else {
                            dataBalance -= t.amount;
                        }
                    }
                    dataLine.datasets[0].data.push(dataBalance);
                }
            });
            timeline.reverse();
            setTimeout(() => {
                ready = true;
                console.log(player);
            }, 5);
        }, (ps) => {
            players = ps;
        });
    });

    function name(player) {
        console.log('finding player', player, players)
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
        <Jellyfish size="60" color="var(--bs-primary)" unit="px" duration="1s" />
    </Row>
{ :else }
    { #if player.player == 0 }
    <Title>Synixe Contractors</Title>
    { :else }
    <Title>Contractor <strong>{player.nickname}</strong></Title>
    { /if }
    <h3>Current Balance ${balance}</h3>
    <Row style="padding-bottom: 1rem">
        <Line data={dataLine} options={{ responsive: true, scales: { xAxes: [{ display: false }] } }} style="height: 20rem"/>
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
                            <span style="float: right">
                                { event.created }
                            </span>
                        { /if }
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
