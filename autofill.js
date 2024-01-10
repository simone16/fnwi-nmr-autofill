// Firefox plugin to store and automatically fill data
// on the NMR booking website of FNWI (UvA Amsterdam).
//
// Author: Simone Pilon <wertyseek at gmail.com>

var autofillGlobal = {
	debugging: true,	// Set to false after development
	inputs: undefined,// list of input fields
	i_group: 2,			// These store the indexes for the inputfield (will be altered by afterLoad()).
	i_passwd: 3,
	i_probe: 4,			// only on the research page
	i_phone: 5,			// 6 on the research page
	routine: true		// Are we on the routine page?
};

// Simple logger, use to print to console
function af_log(message) {
	if (autofillGlobal.debugging) {
		console.log(message);
	}
}

// This is called after the page has loaded.
function afterLoad() {

	// Set global vars according to which page we are on
	autofillGlobal.inputs = document.getElementsByClassName("inputField");
	if (autofillGlobal.inputs[4].children[0].name == "probe") {
		af_log("Detected research page.");
		autofillGlobal.i_phone = 6;
		autofillGlobal.routine = false;
	}

	// Add a button at the end of the page to store the current values for the form.
	af_log("Adding button...");
	let formRows = document.getElementsByClassName("formRow");
	console.log(formRows);
	let storeButton = document.createElement("BUTTON");
	storeButton.setAttribute("type", "button");
	storeButton.addEventListener("click", storeValues);
	storeButton.innerHTML = "Save form values";
	formRows[formRows.length-1].appendChild(storeButton);
	af_log("done");

	// Fill in the form with the stored values.
	fillIn();
}

// Fills in the form with the browser stored data
function fillIn() {
	af_log("Filling in form...");

	// This is called once the browser has found the stored values.
	function onGot(result) {
		af_log(result);
		if (!autofillGlobal.routine) {
			autofillGlobal.inputs[4].children[0].value = "32";
		}
		if (result.group != undefined) {
			autofillGlobal.inputs[autofillGlobal.i_group].children[0].value = result.group;
		}
		if (result.passwd != undefined) {
			autofillGlobal.inputs[autofillGlobal.i_passwd].children[0].value = result.passwd;
		}
		if (result.phone != undefined) {
			autofillGlobal.inputs[autofillGlobal.i_phone].children[0].value = result.phone;
		}
		af_log("done");
	}

	// This is called if the browser does not find the values.
	function onError(error) {
		af_log("Error retrieving stored values!");
	}

	// Create the request for the stored values
	var getting = browser.storage.local.get();
	af_log(getting);
	getting.then(onGot, onError);
}

// Takes the values from the form and stores them in the browser.
function storeValues() {
	af_log("Storing current values...");

	browser.storage.local.set({
		group: autofillGlobal.inputs[autofillGlobal.i_group].children[0].value,
		passwd: autofillGlobal.inputs[autofillGlobal.i_passwd].children[0].value,
		phone: autofillGlobal.inputs[autofillGlobal.i_phone].children[0].value
	});

	af_log("group "+autofillGlobal.inputs[autofillGlobal.i_group].children[0].value);
	af_log("passwd "+autofillGlobal.inputs[autofillGlobal.i_passwd].children[0].value);
	af_log("phone "+autofillGlobal.inputs[autofillGlobal.i_phone].children[0].value);
	af_log("done");
}

afterLoad();
af_log("plugin loaded!");
