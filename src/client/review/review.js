let stars = 5;

select(".star", star => {
	star.addEventListener("mouseenter", () => {
		let sibling = star.nextElementSibling;
		while (sibling) {
			sibling.src = "/assets/images/single_star_empty.png";
			sibling = sibling.nextElementSibling;
		}

		sibling = star;
		while (sibling) {
			sibling.src = "/assets/images/single_star.png";
			sibling = sibling.previousElementSibling;
		}

		stars = Array.from(star.parentElement.children).indexOf(star) + 1;
	});
});

select("#submit").addEventListener("click", async () => {
	const item = select("#item").value;
	const image = select("#image").value;
	const comments = select("#comments").value;
	const description = select("#description").value;
	const errorMsg = select("#errorMsg");
	var tags = [];

	if (!item.match(/^[A-Za-z0-9-_.:#$'+=%]+$/)) {
		errorMsg.innerHTML = "Invalid character in item name";
		return;
	} else {
		errorMsg.innerHTML = "";
	}

	const error = await review(item, stars, comments, image, description, tags);

	if (error) {
		console.error(error);
	} else {
		window.location.href = `/item/${normalize(item)}`;
	}
});

select("#add-tag").addEventListener("click", event => {
	const input = document.createElement("input");
	input.classList.add("tag");
	select("#tags").appendChild(input);
});
