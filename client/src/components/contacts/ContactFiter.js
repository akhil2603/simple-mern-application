import React, {useContext, useRef, useEffect} from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactFiter = () => {
    const contactContext = useContext(ContactContext);
    const text = useRef('');
    const {filterContacts, clearFilterContacts, filtered} = contactContext;
    useEffect(()=>{
        if(filtered === null) {
            text.current.value = '';
        }
    });

    const onChange = e => {
        if(text.current.value !== '') {
            filterContacts(e.target.value);
        } else {
            clearFilterContacts();
        }
    }
    return (
        <form>
            <input type="text" name=""  placeholder="Filter Contacts" onChange={onChange} ref={text}/>
        </form>
    )
}

export default ContactFiter
