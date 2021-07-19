<script lang="ts">
import type { SvelteComponent } from "svelte";


    export let name: string = "";
    export let icon: SvelteComponent;
    export let href: string = "";

    let isActive = false;

    function init() {
        isActive = window.location.hash === href;
    }

    init();
    
    window.addEventListener('hashchange', function() {
        init();
    }, false);
</script>

<li
    class="sidebar-item"
    class:active={isActive}
>
    <a {href} class="sidebar-link">
        <svelte:component this={icon} /> <span class="align-middle">{name}</span>
    </a>
</li>
