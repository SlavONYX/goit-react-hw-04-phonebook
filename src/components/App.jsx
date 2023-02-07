import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (localStorage.getItem('contacts')) {
      setContacts(JSON.parse(localStorage.getItem('contacts')));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const isEmptyString = str => {
    return str.length === 0;
  };

  const isAlreadyExist = name => {
    return contacts.some(
      elem => elem.name.toLowerCase() === name.toLowerCase()
    );
  };

  const addContact = (name, phone) => {
    name = name.trim();
    if (isEmptyString(name) || isEmptyString(phone)) {
      Notify.failure("U can't add empty contact");
      return;
    }
    if (isAlreadyExist(name)) {
      Notify.failure(
        'Contact with same name is already exist please entre new name'
      );
      return;
    }

    const newContact = { name, phone, id: nanoid() };

    setContacts([newContact, ...contacts]);
    setFilter('');
    return true;
  };

  const handleChangeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const deleteContact = contactId => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const getVisibleContacts = () => {
    return contacts.filter(
      ({ name, phone }) =>
        name.toLowerCase().includes(filter.toLowerCase()) ||
        phone.toLowerCase().includes(filter.toLowerCase())
    );
  };

  return (
    <div>
      <h1 className={'mainTitle'}>Phonebook</h1>
      <ContactForm onSubmit={addContact} />
      <h2 className={'title'}>Contacts</h2>
      <Filter value={filter} onChange={handleChangeFilter} />
      <ContactList
        contacts={getVisibleContacts()}
        onDeleteContact={deleteContact}
      />
    </div>
  );
};