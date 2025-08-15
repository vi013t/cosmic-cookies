select("#search", searchInput => {
	searchInput.addEventListener("keypress", event => {
		if (event.key === "Enter") {
			search(searchInput.value);
		}
	});
});
