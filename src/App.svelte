<script lang="ts">
	import Router from 'svelte-spa-router';
	import { MenuIcon } from 'svelte-feather-icons';
	
	import Sidebar from './SideBar/Bar.svelte';
	import Footer from './Footer.svelte';

	// Main Pages
	import Dashboard from './Pages/Dashboard/Index.svelte';
	
	import Contractors from './Pages/Contractors/Index.svelte';
	import Contractor from './Pages/Contractors/Player.svelte';
	// Errors
	import Error404 from './Pages/Errors/404.svelte';

	const routes = {
		'/': Dashboard,

		'/Contractors': Contractors,
		'/Contractor/:player': Contractor,

		'*': Error404,
	}

	function toggleSidebar() {
		document.querySelector('#sidebar').classList.toggle('collapsed');
	}
</script>

<main>
	<div class="wrapper">
		<Sidebar />
		<div class="main">
			<div on:click={toggleSidebar} style="position: fixed; top: 0.2rem; margin-left: 0.2rem;">
				<MenuIcon />
			</div>
			<main class="content">
				<Router {routes}/>
			</main>
			<Footer />
		</div>
	</div>
</main>
