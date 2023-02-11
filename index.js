const contacts = require('./contacts');

contacts
  .listContacts()
  // .removeContact(1)
  // .addContact('Vlad', 'test@gmail.com', '06658392192')
  .then(res => console.log(res))
  .catch(err => console.log(err));
