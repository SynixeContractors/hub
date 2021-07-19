<script>
    import { onMount } from 'svelte';
    import { Row, Card, CardBody } from 'sveltestrap';
    import { Jellyfish } from 'svelte-loading-spinners';
    import { ArrowLeftIcon, ArrowRightIcon } from 'svelte-feather-icons';

    import Title from '../../Title.svelte';

    import contractors from '../../Store/contractors';
    import items from '../../Store/items';

    export let params;// = window.location.hash.replace('#/Contractors/', '').replace('#/Contractors', '').replace('%20', ' ');

    let player = null;
    let timeline = [];
    let ready = false
    let balance = 0;

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
            console.log(p);
            player = p;
            timeline = [];
            timeline = timeline.concat(p.transactions);
            timeline = timeline.concat(p.purchases);
            timeline = timeline.sort(byDate);
            balance = 0;
            p.transactions.forEach(t => {
                balance += t.amount;
            });
            p.purchases.forEach(t => {
                if (!t.global) {
                    balance -= t.amount * t.quantity;
                }
            });
            setTimeout(() => {
                ready = true;
            }, 200);
        });
    });
</script>

{ #if !ready }
    <Row class="justify-content-center jellyfish">
        <Jellyfish size="60" color="var(--bs-primary)" unit="px" duration="1s" />
    </Row>
{ :else }
    <Title>Contractors <strong>{player.nickname}</strong></Title>
    <h3>Current Balacne ${balance}</h3>
    <Row>
        { #each timeline as event }
            <Card>
                <CardBody>
                    { #if event.class }
                        <ArrowRightIcon /> ${ event.amount * event.quantity } <br/>{event.quantity} x <b>{ $items[event.class].pretty }</b> @ ${ event.amount }
                    { :else }
                        <ArrowLeftIcon /> ${ event.amount } <br/>{ event.reason }
                    { /if }
                    <br/>
                    { event.created }
                </CardBody>
            </Card>
        { /each }
    </Row>
{ /if }
