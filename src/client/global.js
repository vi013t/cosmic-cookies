/**
 * @param {string} selector
 *
 * @returns {HTMLElement | HTMLElement[]}
 */
function $(selector) {
	const elements = Array.from(document.querySelectorAll(selector)).map(element => {
		element.on = element.addEventListener;
		return element;
	});
	if (elements.length === 1) return elements[0];
	return elements;
}

const env = {
	firebase: {
		apiKey: "AIzaSyBvEfdE-ephA6cZIwf_2K69NPMaxBDqwVY",
		authDomain: "cosmic-cookies-b2544.firebaseapp.com",
		projectId: "cosmic-cookies-b2544",
		storageBucket: "cosmic-cookies-b2544.firebasestorage.app",
		messagingSenderId: "277481602870",
		appId: "1:277481602870:web:6bdb3cff7b5f61f6793d97",
	},
};

let app;
let db;

backend();

/**
 * Initializes the Firebase app if it's not already and returns the app and database.
 *
 * This is safe to call even if the app is already initialized; It won't be initialized
 * twice. This is the standard way to get a reference to the database.
 *
 * @returns A reference to the app and database.
 */
function backend() {
	if (!app) {
		app = firebase.initializeApp(env.firebase);
		db = firebase.firestore(app);
	}
	return { app, database: db };
}

function database() {
	return backend().database;
}

let currentUser = null;

const auth = firebase.auth();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

function getUser() {
	return currentUser;
}

/**
 * @param {string} email
 * @param {string} password
 *
 * @returns {null | Promise<unknown>} The error, if one occurred.
 */
async function logIn(email, password) {
	try {
		await firebase.auth().signInWithEmailAndPassword(email, password);
		return null;
	} catch (error) {
		console.log(error);
		return error;
	}
}

/**
 * @param {string} email
 * @param {string} password
 * @param {string} username
 *
 * @returns {null | Promise<unknown>} The error, if one occurred.
 */
async function signUp(email, username, password) {
	try {
		let userInfo = await firebase.auth().createUserWithEmailAndPassword(email, password);
		let user = {
			username,
			email,
			reviews: [],
			id: userInfo.user.uid,
		};
		await db.collection("users").add(user);
		return null;
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function logOut() {
	try {
		await firebase.auth().signOut();
		return null;
	} catch (error) {
		return error;
	}
}

const loginHooks = [];
const logoutHooks = [];

function onLogin(listener) {
	loginHooks.push(listener);
}

function onLogout(listener) {
	logoutHooks.push(listener);
}

firebase.auth().onAuthStateChanged(async user => {
	// Logged in
	if (user) {
		console.log("Logged in");
		currentUser = (await db.collection("users").where("id", "==", user.uid).get()).docs[0].data();
		console.log(currentUser);
		loginHooks.forEach(hook => hook(currentUser));
	}

	// logged out
	else {
		console.log("Logged out");
		logoutHooks.forEach(hook => hook());
	}
});
