import React, { useContext, Fragment, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ContactContext from "../../context/contact/contactContext";
import ContactItem from "./ContactItem";
import Spinner from '../layout/Spinner';
const Contacts = () => {
  const contactsContext = useContext(ContactContext);
  const { contacts, filtered, getContacts, loading } = contactsContext;

  useEffect(() => {
    getContacts();
    //eslint-disable-next-line
  }, []);

  if (contacts !== null && contacts.length === 0 && !loading) {
    return <h4>Please add a contact</h4>;
  }
  return (
    <Fragment>
      {contacts !== null && !loading ? (
        <TransitionGroup>
          {filtered !== null
            ? filtered.map(contact => (
                <CSSTransition
                  key={`transition-${contact._id}`}
                  timeout={500}
                  classNames="item"
                >
                  <ContactItem contact={contact} key={contact._id}>
                    {contact.name}
                  </ContactItem>
                </CSSTransition>
              ))
            : contacts.map(contact => (
                <CSSTransition
                  key={`transition-${contact._id}`}
                  timeout={500}
                  classNames="item"
                >
                  <ContactItem contact={contact} key={contact._id}>
                    {contact.name}
                  </ContactItem>
                </CSSTransition>
              ))}
        </TransitionGroup>
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

export default Contacts;
