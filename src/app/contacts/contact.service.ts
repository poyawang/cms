import {Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    // this.getContacts;
    // this.maxContactId = this.getMaxId()
  }

   getContacts() {
    this.http.get<Contact[] >('https://cms-project-3d1c1-default-rtdb.firebaseio.com/contacts.json')
    //subscribe to observable returning
    .subscribe(
      //sucess function
      (contacts: Contact[] ) => {
        //assign the array of documents received to the documents class attribute
        this.contacts = contacts
        this.maxContactId = this.getMaxId()
        //sort alphabetically by name
        this.contacts.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
        // signal that the list has changed
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
  )
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
    // this.contactListChangedEvent.next(contactsListClone)
    this.storeContacts()
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
    // this.contactListChangedEvent.next(contactsListClone)
    this.storeContacts()
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
    // this.contactListChangedEvent.next(contactsListClone)
    this.storeContacts()
  }

  storeContacts() {
    //stringify the list of documnts
    let contacts = JSON.stringify(this.contacts);

    //create header for content type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //put method with url, documents object to replace, and headers
    this.http.put('https://cms-project-3d1c1-default-rtdb.firebaseio.com/contacts.json', contacts, { headers: headers })
      //subscribe to response
      .subscribe(
        () => {
          //once a response has been received, signal that the document list has changed, send copy of list
          this.contactListChangedEvent.next(this.contacts.slice());
        }
      )
  }

}
