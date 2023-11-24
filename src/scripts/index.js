"use strict";

import Contact from "./contact.js";

const contacts = [];

function initiate() {
	[...document.getElementsByClassName("contact-add")].forEach(button=>{
		button.addEventListener("click", addContact);
	});
}
/** @param {Event} e */
function addContact(e) {
	/** @type {string} */
	let inputString = e.target.parentElement.querySelector(".contact-info").value;
	let values = inputString.split(',');
	if (values.length<3) {
		setMessage(e.target.parentElement.querySelector(".message"), `ERROR: Not enough input values - ${values.length} (requires 3)`, true)
		return;
	}
	if (values.length>3) {
		setMessage(e.target.parentElement.querySelector(".message"), `ERROR: Too many input values - ${values.length} (requires 3)`, true)
		return;
	}

	values.forEach((v,i,a) => { //trim all the input strings
		a[i] = v.trim();
	});

	if (values[0]==="") { //validate name
		setMessage(e.target.parentElement.querySelector(".message"), `ERROR: Invalid name - name requires at least 1 non-whitespace character`, true)
		return;
	}

	//city name is alright blank in case the city is unknown.

	//blank or email with an @ symbol is valid. A regex could be used for more precise verification
	if (values[2]!=="" && values[2].indexOf('@')===-1) {
		setMessage(e.target.parentElement.querySelector(".message"), `ERROR: Invalid email - requires an @ symbol`, true)
		return;
	}


	// let name, city, email;
	// [name, city, email] = values;


	contacts.unshift(new Contact(...values));
	setMessage(e.target.parentElement.querySelector(".message"), `Successfully created contact: ${contacts[0].name}`)
	displayContacts();
	updateContactCount()
}

function setMessage(element, string, error) {
	element.innerHTML = string;
	if (error) {
		element.classList.add("error");
	}	else {
		element.classList.remove("error");
	}
}

function displayContacts() {
	[...document.getElementsByClassName("contacts")].forEach(element => {
		element.innerHTML = ""; //bye bye elements

		for (let i=0; i<contacts.length;++i) {
			let newElement = createContactElement(contacts[i]);
			newElement.addEventListener("click", e=>{
				contactClicked(i);
			});
			element.appendChild(newElement);
		}
	});
}
/**@param {Contact} contact */
function createContactElement(contact) {
	let element = document.createElement("div");
	element.classList.add("contact-block");
	["name", "city", "email"].forEach(text=>{
		if (contact[text]!="") {
			let paragraph = document.createElement("p");
			paragraph.classList.add(`contact-${text}`);
			paragraph.innerHTML = `<b>${text}:</b> ${contact[text]}`;
			element.appendChild(paragraph);
		}
	});

	return element;
}

function contactClicked(index) {
	let removed = deleteContact(index);
	displayContacts();
	setMessageAll(`Successfully removed contact: ${removed.name}`);
	updateContactCount();
}

function deleteContact(index) {
	return contacts.splice(index,1)[0];
}

/**
 * Updates all message elements with a message. Helpful when you don't have an element in particular to target.
 * @param {string} message 
 * @param {boolean} error 
 */
function setMessageAll(message, error) {
	[...document.getElementsByClassName("message")].forEach(element=>{
		setMessage(element, message, error);
	});
}

function updateContactCount() {
	[...document.getElementsByClassName("count")].forEach(element=>{ //I should probably make a helper function for this...
		setMessage(element, `Contacts: ${contacts.length}`);
	});
}



initiate();