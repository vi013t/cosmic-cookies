const selectedTags = new Set();

select("#search", searchInput => {
	searchInput.addEventListener("keypress", event => {
		if (event.key === "Enter") {
			search(searchInput.value, [...selectedTags]);
		}
	});
});

select("#tags", tagButton => {
	tagButton.addEventListener("click", () => select("#taglist").classList.toggle("visible"));
});

db.collection("items")
	.get()
	.then(snapshot => {
		let tags = [];
		snapshot.forEach(doc => tags.push(doc.data().tags ?? []));
		tags = tags.flat();
		const tagMap = {};
		tags.forEach(tag => (tagMap[tag] = (tagMap[tag] ?? 0) + 1));
		const sortedTags = Object.entries(tagMap).toSorted(([_tag1, count1], [_tag2, count2]) => count2 - count1);

		const taglist = select("#taglist");
		sortedTags.forEach(([tag, count]) => {
			const button = document.createElement("button");
			button.textContent = `${tag} (${count})`;
			button.classList.add("tag");
			button.addEventListener("click", () => {
				if (selectedTags.has(tag)) selectedTags.delete(tag);
				else selectedTags.add(tag);
				button.classList.toggle("selected");
			});
			taglist.appendChild(button);
		});
	});
