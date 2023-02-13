import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { filterContacts } from 'redux/slice';
import { fetchContacts, addContact, deleteContact } from 'redux/operation';
import {
  selectContacts,
  selectIsLoading,
  selectError,
  selectFilter,
} from 'redux/selector';
import { nanoid } from 'nanoid';

import { Section } from './App.styles';
import { Loader } from 'components/Loader/Loader';
import { ContactForm } from '../ContactForm/ContactForm ';
import { ContactList } from '../ContactList/ContactList';
import { Filter } from '../Filter/Filter';

export const App = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const filter = useSelector(selectFilter);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const filterUsers = event => {
    dispatch(filterContacts(event.target.value));
  };

  const deleteUsers = userId => {
    dispatch(deleteContact(userId));
  };

  const verification = () => {
    if (!filter) {
      return contacts;
    } else {
      return contacts.filter(
        user =>
          user.name.toLowerCase().includes(filter.toLowerCase()) ??
          user.number.includes(filter)
      );
    }
  };

  function formSubmitHandler(data) {
    if (contacts.find(contact => contact.name === data.name)) {
      alert(`${data.name} is already in contacts!`);
      return;
    }
    const newUser = {
      id: nanoid(),
      ...data,
    };
    dispatch(addContact(newUser));
  }

  return (
    <>
      {error ? (
        <p>Something went wrong</p>
      ) : (
        <>
          {loading && <Loader />}

          <Section>
            <h1>Phonebook</h1>
            <ContactForm onContactSubmit={formSubmitHandler} />
            <h2>Contacts</h2>
            <Filter filter={filter} click={filterUsers} />
            <ContactList contacts={verification()} deleteUsers={deleteUsers} />
          </Section>
        </>
      )}
    </>
  );
};
