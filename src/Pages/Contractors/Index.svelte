<script>
    import { onMount } from 'svelte';
    import { Row, Card, CardBody } from 'sveltestrap';
    import { Jellyfish } from 'svelte-loading-spinners';

    import Title from '../../Title.svelte';

    import contractors from '../../Store/contractors';
import { LOADER_SIZE } from '../../loader';

    onMount(() => {
        contractors.ensure() 
    });
</script>

<Title><strong>Contractors</strong></Title>

{ #if $contractors.length == 0 }
    <Row class="justify-content-center jellyfish">
        <Jellyfish size={LOADER_SIZE} color="var(--bs-primary)" unit="px" duration="1s" />
    </Row>
{ :else }
    <Row>
        { #each $contractors as contractor }
        { #if !contractor.hidden }
        <div class="col-3 d-flex">
            <Card class="flex-fill">
                <CardBody>
                    <a href="#/Contractor/{contractor.player}">{contractor.nickname}</a>
                </CardBody>
            </Card>
        </div>
        { /if }
        { /each }
    </Row>
{ /if }
