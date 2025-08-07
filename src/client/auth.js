const {
	browserLocalPersistence,
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	setPersistence,
	signInWithEmailAndPassword,
	signOut,
} = require("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js");

const { doc, setDoc, collection, query, where, getDocs } = require("https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js");

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
function firebase() {
	if (!app) {
		app = initializeApp(env.firebase);
		db = getFirestore(app);
	}
	return { app, database: db };
}

function database() {
	return firebase().database;
}

let currentUser = null;

const auth = getAuth();
setPersistence(auth, browserLocalPersistence);

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
		await signInWithEmailAndPassword(auth, email, password);
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
		let userInfo = await createUserWithEmailAndPassword(auth, email, password);
		let user = {
			username,
			email,
			reviews: [],
			id: userInfo.user.uid,
		};
		await setDoc(doc(db, "users", user.id), user);
		return null;
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function logOut() {
	try {
		await signOut(auth);
		return null;
	} catch (error) {
		console.log(error);
		return error;
	}
}

onAuthStateChanged(auth, async user => {
	// Logged in
	if (user) {
		currentUser = await getDocs(query(collection(db, "users"), where("id", "==", user.uid))).docs[0].data();
		console.log(currentUser);
	}

	// logged out
	else {
		console.log("Logged out");
	}
});
