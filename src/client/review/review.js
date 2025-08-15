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
		console.log(stars);
	});
});

select("#submit").addEventListener("click", async () => {
	const item = select("#item").value;
	const image = select("#image").value;
	const comments = select("#comments").value;
	const description = select("#description").value;
	const error = await review(item, stars, comments, image, description);

	if (error) {
		console.error(error);
	} else {
		window.location.href = `/item/${normalize(item)}`;
	}
});
