const itemName = getServerData("item");
const reviews = [];

select("*[data-item-name]", element => (element.textContent = itemName));

db.collection("reviews")
	.where("item", "==", normalize(itemName))
	.get()
	.then(docs => {
		docs.forEach(doc => reviews.push(doc.data()));

		reviews.forEach(async review => {
			const author = (await db.collection("users").where("id", "==", review.user).get()).docs[0].data();

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
