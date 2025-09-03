select("#login", loginButton => {
	loginButton.addEventListener("click", async () => {
		const email = select("#email").value;
		const password = select("#password").value;
		const error = await logIn(email, password);
		if (error) {
			console.error(error);
		} else {
			window.location.href = "/profile";
		}
	});
});

select(".show-password", button => {
	button.addEventListener("click", event => {
		const input = button.previousElementSibling;

		// Show password
		if (input.type === "password") {
			input.type = "text";
		}

		// Hide password
		else {
			input.type = "password";
		}
	});
});

select("#signup", button => {
	button.addEventListener("click", event => {
		window.location.href = "/signup";
	});
});

