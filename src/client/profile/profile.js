onLogin(user => {
	select("*[data-username]", element => (element.textContent = `@${user.username}`));
});

onLogout(() => {
	window.location.href = "/login";
});

select("#logout", logoutButton => {
	logoutButton.addEventListener("click", async () => {
		const error = await logOut();

		if (error) {
			console.error(error);
		} else {
			window.location.href = "/index.html";
		}
	});
});
