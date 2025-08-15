let reviews = [];
const searchTerm = new URLSearchParams(document.location.search).get("term");
let allItems = [];
const itemPages = [];
const page = 1;

db.collection("reviews")
	.get()
	.then(docs => {
		docs.forEach(doc => reviews.push(doc.data()));

		const normalized = normalize(searchTerm);
		allItems = Array.from(new Set(reviews.map(review => review.item)))
			.map(itemName => {
				const reviewsForThisItem = reviews.filter(other => other.item === itemName).map(review => review.stars);
				return {
					name: itemName,
					rating: reviewsForThisItem.reduce((total, current) => current + total, 0) / reviewsForThisItem.length,
				};
			})
			.toSorted((firstItem, secondItem) => levenshteinDistance(firstItem.name, normalized) - levenshteinDistance(secondItem.name, normalized));

		const chunkSize = 10;
		for (let i = 0; i < allItems.length; i += chunkSize) {
			const page = allItems.slice(i, i + chunkSize);
			itemPages.push(page);
		}

		itemPages[page - 1].forEach(item => {
			const button = document.createElement("div");
			button.setAttribute("data-item-name", item.name);
			button.classList.add("item-listing");

			const header = document.createElement("div");
			header.classList.add("item-listing-header");

			const h3 = document.createElement("h3");
			h3.textContent = item.name;
			header.appendChild(h3);

			const starContainer = document.createElement("div");
			starContainer.classList.add("star-container");
			header.appendChild(starContainer);

			const stars = document.createElement("img");
			stars.src = "/assets/images/star5.png";
			stars.classList.add("stars");
			starContainer.appendChild(stars);

			const starBlocker = document.createElement("span");
			starBlocker.classList.add("star-blocker");
			starBlocker.style.width = `${(5 - item.rating) * 2}rem`;
			starBlocker.innerHTML = `&nbsp;&nbsp;(${reviews.filter(review => review.item === item.name).length})`;
			starContainer.appendChild(starBlocker);

			const p = document.createElement("p");
			p.textContent = "No description available.";

			button.appendChild(header);
			button.appendChild(p);

			select("#items").appendChild(button);
		});

		select(".item-listing", button => {
			button.addEventListener("click", () => {
				window.location.href = `/item/${button.getAttribute("data-item-name")}`;
			});
		});
	});

select(".new > button").addEventListener("click", () => {
	window.location.href = "/review";
});

select("#search", searchInput => {
	searchInput.value = searchTerm;
	searchInput.addEventListener("keypress", event => {
		if (event.key === "Enter") {
			event.preventDefault();
			search(searchInput.value);
		}
	});
});

/**
 * Calculates and returns the Levenshtein distance between two strings. The distance is a number
 * that represents the "minimum number of single-character edits (insertions, deletions, or
 * substitutions) required to change one word into the other". Essentially it's a measure of
 * how close the two words are. The larger the number, the further the strings are apart.
 *
 * # Parameters
 *
 * @param {string} a The first string
 * @param {string} b The other string
 *
 * @returns {number} The Levenshtein distance between the two strings.
 */
function levenshteinDistance(a, b) {
	let insertionCost;
	let deletionCost;
	let substitutionCost;

	let dummy;
	let m = a.length;
	let n = b.length;

	let v0 = [];
	let v1 = [];

	for (let i = 0; i <= n; i++) v0[i] = i;

	for (let i = 0; i < m; i++) {
		v1[0] = i + 1;

		for (let j = 0; j < n; j++) {
			deletionCost = v0[j + 1] + 1;
			insertionCost = v1[j] + 1;

			if (a.charAt(i) == b.charAt(j)) substitutionCost = v0[j];
			else substitutionCost = v0[j] + 1;

			v1[j + 1] = Math.min(deletionCost, insertionCost, substitutionCost);
		}

		dummy = v0;
		v0 = v1;
		v1 = dummy;
	}

	return v0[n];
}
