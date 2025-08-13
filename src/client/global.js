/**
 * Selects elements in the DOM that match the given selector, and optionally
 * run a callback on each of them.
 *
 * @param {string} selector The selector to select elements of
 * @param {undefined | (element: HTMLElement) => any} callback A callback to run
 * on each of the elements
 *
 * @returns {HTMLElement | HTMLElement[]} The elements that matched the selector
 */
function select(selector, callback) {
	const elements = Array.from(document.querySelectorAll(selector));
	if (callback) elements.forEach(callback);
	if (elements.length === 1) return elements[0];
	return elements;
}

/**
 * The environment variables / configuration
 */
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
 * @returns { { app: unknown, database: unknown } } A reference to the app and database.
 */
function backend() {
	if (!app) {
		app = firebase.initializeApp(env.firebase);
		db = firebase.firestore(app);
	}
	return { app, database: db };
}

/**
 * Get a reference to the database. If Firebase hasn't been initializd yet,
 * it will be before returning the database reference.
 *
 * @returns {unknown} The database object
 */
function database() {
	return backend().database;
}

/**
 * @typedef {Object} User A user in the database
 *
 * @property {string} username The unique username of the user
 * @property {string[]} reviews The Ids of the reviews the user has made
 * @property {string} email The user's email
 */

/** @type {User | null} */
let currentUser = null;

const auth = firebase.auth();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

/**
 * Get a reference to the current user. If the user is not logged into an
 * account, `null` is returned.
 *
 * @returns {User | null}
 */
function getUser() {
	return currentUser;
}

/**
 * Log into an existing account using email and password. If an error occurs, such
 * as the account doesn't exist or the credentials don't match, the error is returned.
 * Otherwise, `null` is returned.
 *
 * @param {string} email The email to log in with
 * @param {string} password The password associated with the account
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
 * Creates a new user account in the database. The account is saved both to the
 * authentication service and the database itself. If an error occurs anywhere in
 * the process, it is returned (wrapped in a promise). If no error occurs, a promise
 * that resolves to `null` is returned.
 *
 * @param {string} email The email to sign up with
 * @param {string} username The username to sign up with
 * @param {string} password The password to sign up with
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
		await db.collection("users").doc(userInfo.user.uid).set(user);
		return null;
	} catch (error) {
		return error;
	}
}

/**
 * Hopefull creates a new review in the database.
 * sorry idk what everything means i'm just copying your style
 *
 * @param {string} item the item name
 * @param {string} stars the number out of five of the review
 * @param {string} comment the comment for the review
 *
 * @returns {null | Promise<unknown>} The error, if one occurred.
 */
async function review(item, stars, comment) {
	try {
		let review = {
			user: currentUser.id,
			item: item,
			stars: stars,
			comment: comment
		};
		const reviewId = await db.collection("reviews").doc();
		await reviewId.set(review);
		userRef = await db.collection("users").doc("ORqDxy2EQYNQVXExTrotP5Thd6H3")
		userRef.update({
			reviews: firebase.firestore.FieldValue.arrayUnion(reviewId.id)
		});
		return null;
	} catch (error) {
		return error;
	}
}

/**
 * Logs the user out of their account. If an error occurs while attempting
 * to sign out, the error is returned (wrapped in a promise). Otherwise,
 * a promise that resolves to `null` is returned.
 *
 * @returns {Promise<unknown | null} The error, if one occurred
 */
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

/**
 * Add a hook to run when the user logs in. The callback will also run when a
 * page initially loads, if the user is logged in.
 *
 * @param {(user: User) => any} listener The callback hook, which takes the user as a parameter
 *
 * @returns {void}
 */
function onLogin(listener) {
	loginHooks.push(listener);
}

/**
 * Add a hook to run when the user logs out. The callback will also run when a
 * page initially loads, if the user is logged out.
 *
 * @param {() => any} listener The callback hook
 *
 * @returns {void}
 */
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
