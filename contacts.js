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
    throw new Error(err.message);
  }
}

/**
 * Gets single contact from collection
 * @param {Number} contactId Contact ID
 * @returns {Promise} Fulfills with the single contact data
 */
async function getContactById(contactId) {
  if (contactId === '' || contactId === undefined) {
    throw new Error('Contact id should not be empty');
  }

  try {
    const contactsList = await listContacts();

    const filteredContacts = contactsList.filter(
      ({ id }) => Number(id) === Number(contactId)
    );

    if (!filteredContacts.length) {
      throw new Error(`Contact with ID - "${contactId}", was not found.`);
    }

    return filteredContacts[0];
  } catch (err) {
    throw new Error(err.message);
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
    const contactsList = await listContacts();

    const filteredContacts = contactsList.filter(
      ({ id }) => Number(id) !== Number(contact.id)
    );

    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));

    return contact.id;
  } catch (err) {
    throw new Error(err.message);
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
    throw new Error('Contact name should not be empty');
  }

  if (email === '' || email === undefined) {
    throw new Error('Contact email should not be empty');
  }

  if (phone === '' || phone === undefined) {
    throw new Error('Contact phone should not be empty');
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
    throw new Error(err.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
