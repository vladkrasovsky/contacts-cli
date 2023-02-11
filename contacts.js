const path = require('path');
const fs = require('fs').promises;

const contactsPath = path.resolve('./db/contacts.json');
const encoding = 'utf8';

/**
 * Gets contacts list from collection
 * @returns {Promise} Fulfills with contacts list
 */
async function listContacts() {
  try {
    const fileData = await fs.readFile(contactsPath, { encoding });
    return fileData ? JSON.parse(fileData) : [];
  } catch (err) {
    return err.message;
  }
}

/**
 * Gets single contact from collection
 * @param {Number} contactId Contact ID
 * @returns {Promise} Fulfills with the single contact data
 */
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts
      .filter(({ id }) => Number(id) === Number(contactId))
      .shift();
  } catch (err) {
    return err.message;
  }
}

/**
 * Removes single contact from collection
 * @param {Number} contactId Contact ID
 * @returns {Promise} Fulfills with the Contact ID
 */
async function removeContact(contactId) {
  try {
    const contact = await getContactById(contactId);

    if (!contact) {
      return Promise.reject(`Contact with ID - "${contactId}", was not found.`);
    }

    const contactsList = await listContacts();
    const filteredContacts = contactsList.filter(
      ({ id }) => Number(id) !== Number(contactId)
    );

    const res = await fs.writeFile(
      contactsPath,
      JSON.stringify(filteredContacts)
    );

    return contactId;
  } catch (err) {
    return err.message;
  }
}

/**
 * Adds new single contact to collection
 * @param {String} name Contact Name
 * @param {String} email Contact Email
 * @param {String} phone Contact Phone
 * @returns {Promise} Fulfills with the single contact data
 */
async function addContact(name, email, phone) {
  if (name === '' || name === undefined) {
    return Promise.reject('Contact name should not be empty');
  }

  if (email === '' || email === undefined) {
    return Promise.reject('Contact email should not be empty');
  }

  if (phone === '' || phone === undefined) {
    return Promise.reject('Contact phone should not be empty');
  }

  try {
    const contacts = await listContacts();
    const lastContactId = Number(contacts[contacts.length - 1]?.id) || 0;

    const id = `${lastContactId + 1}`;
    const newContact = {
      id,
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    return newContact;
  } catch (err) {
    return err.message;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
