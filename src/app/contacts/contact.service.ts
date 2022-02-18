import {Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  //subject property
  contactListChangedEvent = new Subject<Contact[]>();

  //property for max id
  maxContactId: number;

  contacts: Contact[] =[];

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.getContacts;
    this.maxContactId = this.getMaxId()
  }

   getContacts() {
     return this.contacts.slice()
   };

   getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

   getContact(id:string): Contact{
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }
  addContact(newContact: Contact) {
    if(!newContact){
      return;
    }
    this.maxContactId++
    newContact.id = this.maxContactId.toString()
    this.contacts.push(newContact);
    let contactsListClone = this.contacts.slice()
    this.contactListChangedEvent.next(contactsListClone)
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return
    }

    //get position of original Contact
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id
    this.contacts[pos] = newContact
    let contactsListClone = this.contacts.slice()
    this.contactListChangedEvent.next(contactsListClone)
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    let contactsListClone = this.contacts.slice()
    this.contactListChangedEvent.next(contactsListClone)
  }


}
