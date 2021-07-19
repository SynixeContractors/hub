import './Resources/Styles/app.scss';

import App from './App.svelte';

import items from './Store/items';

items.ensure();

const app = new App({
	target: document.body,
});

export default app;
