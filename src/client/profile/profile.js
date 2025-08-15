const username = getServerData("user");
db.collection("users")
	.where("username", "==", username)
	.get()
	.then(query => showUser(query.docs[0].data()));

function showUser(user) {
	select("*[data-username]", element => (element.textContent = `@${user.username}`));
	select("*[data-display-name]", element => (element.textContent = `${user.displayName}`));
	select("*[data-profile-picture]", element => (element.src = user.profilePicture));
}

onLogin(user => {
	if (!username) showUser(user);
});

onLogout(() => {
	if (!username) window.location.href = "/login";
});

select("#logout", logoutButton => {
	logoutButton.addEventListener("click", async () => {
		const error = await logOut();

		if (error) {
			console.error(error);
		} else {
			window.location.href = "/";
		}
	});
});
