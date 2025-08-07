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

$("#create").on("click", async () => {
	const email = $("#email").value;
	const username = $("#username").value;
	const password = $("#password").value;

	const error = await signUp(email, username, password);

	if (error) {
	} else {
		window.location.href = "/profile";
	}
});
