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

select("#create", createButton => {
	createButton.addEventListener("click", async () => {
		const email = select("#email").value;
		const username = select("#username").value;
		const password = select("#password").value;

		const errorMsg = select("#errorMsg");
		if (!username.match(/^\w+$/)) {
			errorMsg.innerHTML = "Please only use alphanumeric characters or underscores in your username.";
			return;
		} else {
			errorMsg.innerHTML = "";
		}

		const error = await signUp(email, username, password);

		if (error) {
		} else {
			window.location.href = "/profile";
		}
	});
});
