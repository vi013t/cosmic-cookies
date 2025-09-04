const itemName = getServerData("item");
const reviews = [];

select("*[data-item-name]", element => (element.textContent = itemName));

const normalName = normalize(itemName);

onLogout(() => {
	select("#review-container").remove();
	select("#log-in").style.display = "block";
});

db.collection("reviews")
	.where("item", "==", normalName)
	.get()
	.then(async docs => {
		docs.forEach(doc => reviews.push(doc.data()));

		let itemEntry = (await db.collection("items").where("name", "==", normalName).get()).docs;
		if (itemEntry.length === 0) {
			await db.collection("items").add({
				name: normalName,
				image: "https://as2.ftcdn.net/jpg/02/51/95/53/1000_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg",
			});
			itemEntry = (await db.collection("items").where("name", "==", normalName).get()).docs;
		}

		const itemData = itemEntry[0].data();

		select("*[data-item-image]", img => (img.src = itemData.image));

		const reviewObjects = (
			await Promise.all(
				reviews.map(async review => ({ author: (await db.collection("users").where("id", "==", review.user).get()).docs[0].data(), review })),
			)
		).toSorted((obj1, obj2) => {
			if (getUser()?.username === obj1.author.username) return -1;
			if (getUser()?.username === obj2.author.username) return 1;
			return 0;
		});

		reviewObjects.forEach(async ({ author, review }) => {
			if (getUser()?.username === author.username) {
				select("#review-container").remove();
			}

			const reviewElement = document.createElement("div");
			reviewElement.classList.add("review");

			const header = document.createElement("div");
			header.classList.add("header");
			header.addEventListener("click", () => {
				window.location.href = `/profile/${author.username}`;
			});

			const profilePicture = document.createElement("img");
			profilePicture.classList.add("profile-picture");
			profilePicture.src = author.profilePicture;
			header.appendChild(profilePicture);

			const name = document.createElement("name");
			name.classList.add("name");

			const authorElement = document.createElement("h3");
			authorElement.textContent = author.displayName;
			name.appendChild(authorElement);

			const authorTag = document.createElement("h4");
			authorTag.textContent = `@${author.username}`;
			name.appendChild(authorTag);

			header.appendChild(name);

			const stars = document.createElement("img");
			stars.src = `/assets/images/star${review.stars}.png`;
			stars.classList.add("stars");
			header.appendChild(stars);

			reviewElement.appendChild(header);

			const comment = document.createElement("p");
			comment.textContent = review.comment;
			reviewElement.appendChild(comment);

			select("main").appendChild(reviewElement);
		});
	});

select("#post", button => {
	button.addEventListener("click", async () => {
		const body = select("#your-review").value;
		const error = await reviewExisting(itemName, 5, body);
		window.location.reload();
	});
});
