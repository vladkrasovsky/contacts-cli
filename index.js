const contacts = require('./contacts');
const argv = require('yargs').argv;
const { red, green } = require('./helpers/consoleColors');

async function invokeAction({ action, id, name, email, phone }) {
  try {
    switch (action) {
      case 'list':
        const contactsList = await contacts.listContacts();
        console.table(contactsList);
        break;

      case 'get':
        const contact = await contacts.getContactById(id);
        console.log(contact);
        break;

      case 'add':
        const newContact = await contacts.addContact(name, email, phone);
        console.log(newContact);
        break;

      case 'remove':
        await contacts.removeContact(id);
        console.log(
          `${green} Contact with ID - "${id}", was successfuly deleted.`
        );
        break;

      default:
        console.warn(`${red} Unknown action type!`);
    }
  } catch (error) {
    console.warn(`${red} ${error}`);
  }
}

invokeAction(argv);
