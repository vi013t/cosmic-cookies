import express from "express";

const app = express();
app.use(express.static("src/client"));
app.use(express.json());

const port = 3000;
const hostname = "localhost";

app.get("/search/:term", (request, response) => {
	const term = request.params.term;
	response.contentType("html");
	response.send(`
<!doctype html>
<html>
	<head>
		<link rel="stylesheet" href="./global.css" />
		<script defer src="./index.js" type="module"></script>
	</head>

	<body>
		<h1>You searched for ${term}</h1>
	</body>
</html>`);
});

app.get("/profile", (request, response) => {});
app.get("/item", (request, response) => {});

app.listen(port, hostname, () => {
	console.log(`http://${hostname}:${port}`);
});
