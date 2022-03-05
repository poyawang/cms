import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})

export class ContactsFilterPipe implements PipeTransform {


  //function to transform the incoming value
  transform(contacts: any, [term]) {
    //variable to store filtered array
    let filteredContacts: Contact[] = [];

    if (term && term.length > 0) {
      filteredContacts = contacts.filter(
      (contact:Contact) => contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    //if there is nothing on the filtered array...
    if (filteredContacts.length < 1) {
      //return original array of contacts
      return [...contacts];
    }

    //if something was found, return the filtered array
    return filteredContacts;
  }
}
