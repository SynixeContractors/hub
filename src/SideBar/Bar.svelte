<script>
    import SimpleBar from "simplebar";
    import { onMount } from 'svelte';
    import { BriefcaseIcon, SlidersIcon, UserIcon } from 'svelte-feather-icons';
    
    import Link from './Link.svelte';

    const initialize = () => {
        initializeSimplebar();
        initializeSidebarCollapse();
    }

    const initializeSimplebar = () => {
        const simplebarElement = document.getElementsByClassName("js-simplebar")[0];
        if(simplebarElement){
            const simplebarInstance = new SimpleBar(simplebarElement);
            /* Recalculate simplebar on sidebar dropdown toggle */
            const sidebarDropdowns = document.querySelectorAll(".js-sidebar [data-bs-parent]");
            sidebarDropdowns.forEach(link => {
                link.addEventListener("shown.bs.collapse", () => {
                    simplebarInstance.recalculate();
                });
                link.addEventListener("hidden.bs.collapse", () => {
                    simplebarInstance.recalculate();
                });
            });
        }
    }

    const initializeSidebarCollapse = () => {
        const sidebarElement = document.getElementsByClassName("js-sidebar")[0];
        const sidebarToggleElement = document.getElementsByClassName("js-sidebar-toggle")[0];

        if(sidebarElement && sidebarToggleElement) {
            sidebarToggleElement.addEventListener("click", () => {
                sidebarElement.classList.toggle("collapsed");
                sidebarElement.addEventListener("transitionend", () => {
                    window.dispatchEvent(new Event("resize"));
                });
            });
        }
    }

    onMount(() => {
        initialize();
    });
</script>

<nav id="sidebar" class="sidebar js-sidebar">
    <div class="sidebar-content js-simplebar">
        <a class="sidebar-brand" href="index.html">
            <span class="align-middle">Synixe Contractors</span>
        </a>

        <ul class="sidebar-nav">
            <Link href="#/" icon={SlidersIcon} name="Dashboard" />
            <Link href="#/Contractor/0" icon={BriefcaseIcon} name="Group" />
            <Link href="#/Contractors" icon={UserIcon} name="Contractors" />

        </ul>
    </div>
</nav>
