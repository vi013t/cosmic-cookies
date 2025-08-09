select("#search", searchButton => {
	searchButton.addEventListener("keypress", event => {
		if (event.key === "Enter") {
			event.preventDefault();
			window.location.href = `/search/${$("#search").value}`;
		}
	});
});
