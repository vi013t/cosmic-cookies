document.getElementById("submit").addEventListener("click", async () => {
	const item = document.getElementById("item").value;
	const stars = 4;
	const comments = document.getElementById("comments").value;
	const error = await review(item, stars, comments);
	if (error) {
		console.error(error);
	} else {
		//window.location.href = "/profile";
	}
});
