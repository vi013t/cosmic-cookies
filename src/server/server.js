import express from "express";

const app = express();
app.use(express.static("src/client"));
app.use(express.json());

const port = 3000;
const hostname = "localhost";

app.get("/search", (request, response) => {
	const term = request.params.term;
	response.contentType("html");
	response.send();
});

app.get("/", (_request, response) => {
	response.redirect("/home");
});

app.listen(port, hostname, () => {
	console.log(`http://${hostname}:${port}`);
});
