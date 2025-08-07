$("#login").on("click", async () => {
	const email = $("#email").value;
	const password = $("#password").value;
	const error = await logIn(email, password);
	if (error) {
		console.error(error);
	} else {
		window.location.href = "/profile";
	}
});

$(".show-password").on("click", event => {
	const input = $(".show-password").previousElementSibling;

	// Show password
	if (input.type === "password") {
		input.type = "text";
	}

	// Hide password
	else {
		input.type = "password";
	}
});
