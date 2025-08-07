import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import env from "./env.js";

let app;
let db;

firebase();

/**
 * Initializes the Firebase app if it's not already and returns the app and database.
 *
 * This is safe to call even if the app is already initialized; It won't be initialized
 * twice. This is the standard way to get a reference to the database.
 *
 * @returns A reference to the app and database.
 */
export default function firebase() {
	if (!app) {
		app = initializeApp(env.firebase);
		db = getFirestore(app);
	}
	return { app, database: db };
}

export function database() {
	return firebase().database;
}

/**
 * @typedef {Object} Review
 *
 * @property {string} itemId
 * @property {string} authorId
 * @property {string} review
 * @property {number} rating
 */

/**
 * @typedef {Object} User
 *
 * @property {string} username
 * @property {string} id
 * @property {string} email
 * @property {string[]} reviewIds
 */

/**
 * @typedef {Object} Item
 *
 * @property {string} id
 * @property {string} name
 */
