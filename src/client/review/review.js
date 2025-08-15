var stars = 5;

document.getElementById("star1").addEventListener("click", async () => {
	stars = 1;
	resetImg();
});
document.getElementById("star2").addEventListener("click", async () => {
	stars = 2;
	resetImg();
});
document.getElementById("star3").addEventListener("click", async () => {
	stars = 3;
	resetImg();
});
document.getElementById("star4").addEventListener("click", async () => {
	stars = 4;
	resetImg();
});
document.getElementById("star5").addEventListener("click", async () => {
	stars = 5;
	resetImg();
});

function changeImg(starpower) {
	var image = document.getElementById("stars");
	image.src = "../assets/images/star" + starpower + ".png";
}

function resetImg() {
	var image = document.getElementById("stars");
	image.src = "../assets/images/star" + stars + ".png";
}

document.getElementById("submit").addEventListener("click", async () => {
	const item = document.getElementById("item").value;
	const comments = document.getElementById("comments").value;
	const error = await review(item, stars, comments);
	if (error) {
		console.error(error);
	} else {
	}
});
