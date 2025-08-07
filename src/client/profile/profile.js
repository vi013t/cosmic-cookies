onLogin(user => {
	$("#username").textContent = `@${user.username}`;
});

onLogout(() => {
	window.location.href = "/login";
});

$("#logout").on("click", async () => {
	const error = await logOut();

	if (error) {
		console.error(error);
	} else {
		window.location.href = "/index.html";
	}
});
