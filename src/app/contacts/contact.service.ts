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
    //use http get
    this.http.get<{ message: string, contacts: Contact[] }>('http://localhost:3000/contacts')
      //subscribe to observable returning
      .subscribe(
        //sucess function
        (responseData) => {
          //assign the array of contacts received to the contacts class attribute
          this.contacts = responseData.contacts;
          //sort alphabetically by name
          this.contacts.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
          //signal that the list has changed
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.log(error);
        }
      )
  }

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
    ////check if contact is defined
    if (!newContact) {
      //exit
      return;
    }

    //set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //convert object to string to send in req
    newContact.id = '';
    const strContact = JSON.stringify(newContact);

    //send req with object and headers
    this.http.post('http://localhost:3000/contacts', strContact, { headers: headers })
      //subscribe to response
      .subscribe(
        (contacts: Contact[]) => {
          //assign contact list
          this.contacts = contacts;
          //emit changes
          this.contactChangedEvent.next(this.contacts.slice());
        });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    //check if contact or update is defined
    if (!originalContact || !newContact) {
      //exit
      return;
    }

    //geet position in list of contacts
    const pos = this.contacts.indexOf(originalContact);
    //if position is not in array
    if (pos < 0) {
      //exit
      return;
    }

    //set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //conver object to string to send in req
    const strContact = JSON.stringify(newContact);

    //send req with contact id, object and headers
    this.http.patch('http://localhost:3000/contacts/' + originalContact.id
      , strContact
      , { headers: headers })
      //subscribe to response
      .subscribe(
        (contacts: Contact[]) => {
          //assign contacts list
          this.contacts = contacts;
          //emit changes
          this.contactChangedEvent.next(this.contacts.slice());
        });
  }

  deleteContact(contact: Contact) {
    //check if contact is undefined
    if (!contact) {
      //exit
      return;
    }

    //send request with specific id
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      //subscribe to response
      .subscribe(
        (contacts: Contact[]) => {
          //assing list of contacts
          this.contacts = contacts;
          //emit changes
          this.contactChangedEvent.next(this.contacts.slice());
        });
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
