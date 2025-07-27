import express from "express";

const app = express();
app.use(express.static("src/client"));
app.use(express.json());

const port = 3000;
const hostname = "localhost";

app.listen(port, hostname, () => {
	console.log(`http://${hostname}:${port}`);
});
