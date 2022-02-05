import {Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();

  contacts: Contact[] =[];

   getContacts() {
     return this.contacts.slice()
   };



   getContact(id:string): Contact{
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

   constructor() {
      this.contacts = MOCKCONTACTS;
   }
}
