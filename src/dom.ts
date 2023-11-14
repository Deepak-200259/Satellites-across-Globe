export function hideFetching() {
	const el = document.querySelector(".fetching-indicator")! as HTMLDivElement;
	el.hidden = true;
}
