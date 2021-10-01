<script lang="ts">
	import Router from 'svelte-spa-router';
	
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
</script>

<main>
	<div class="wrapper">
		<Sidebar />
		<div class="main">
			<main class="content">
				<Router {routes}/>
			</main>
			<Footer />
		</div>
	</div>
</main>
