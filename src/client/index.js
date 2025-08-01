/**
 * @param {string} selector
 *
 * @returns {HTMLElement | HTMLElement[]}
 */
function $(selector) {
	const elements = Array.from(document.querySelectorAll(selector)).map(element => {
		element.on = element.addEventListener;
		return element;
	});
	if (elements.length === 1) return elements[0];
	return elements;
}

$("#search").on("keypress", event => {
	if (event.key === "Enter") {
		event.preventDefault();
		window.location.href = `/search/${$("#search").value}`;
	}
});
