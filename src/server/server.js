import express from "express";
import { join, dirname } from "path";
import { readFileSync } from "fs";

const app = express();
app.use(express.static("src/client"));
app.use(express.json());

const port = 3000;
const hostname = "localhost";

/**
 * Redirects to an HTML file (without changing the URL), while also sending
 * some data to the file.
 *
 * # Parameters
 *
 * @param {Response} response The express `response` object
 * @param {string} path The path of the HTML file, relative to "/src/client/"
 * @param {{ [key: string]: unknown }} data A key-value pair of data to send to the client; Read `Usage` below for more info.
 *
 * # Usage
 *
 * When you call this function (on the server), pass the data
 * you want to send to the client in the data parameter:
 *
 * ```js
 * sendFileWithData(response, "profile/index.html", { key: value })
 * ```
 *
 * On the client, use `getServerData()` (from `global.js`) to get the
 * value of the variable:
 *
 * ```js
 * const value = getServerData("key").
 * ```
 *
 * Note: Keys must only contain letters, underscores, and hyphens
 * (if you really care, the exact allowed character list is
 * [here](https://stackoverflow.com/a/25898182))
 *
 * @returns {void}
 */
function sendFileWithData(response, path, data) {
	let html = readFileSync(
		join(dirname(import.meta.url), `../client/${path}`)
			.substring(5)
			.replaceAll(/%20/g, " ")
			.replaceAll(/C:\\C:\\/g, "C:\\"),
		{ encoding: "utf8" },
	);

	let headAttributes = "";
	Object.entries(data).forEach(([key, value]) => {
		headAttributes += ` data-${key}="${value}"`;
	});
	html = html.replace("<head", `<head${headAttributes}`);

	response.contentType("html");
	response.send(html);
}

app.get("/profile/:name", (request, response) => {
	return sendFileWithData(response, "profile/index.html", { user: request.params.name });
});

app.get("/item/:name", (request, response) => {
	return sendFileWithData(response, "item/index.html", { item: request.params.name });
});

app.get("/", (_request, response) => {
	response.redirect("/home");
});

app.listen(port, hostname, () => {
	console.log(`http://${hostname}:${port}`);
});
