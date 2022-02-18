import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts: Contact[] = []

  constructor(private contactService: ContactService) { }

  //subscription property
  private subscription: Subscription;

  ngOnInit():void {
    //subscribe to changes on the contact list, store in subscription
    this.subscription = this.contactService.contactListChangedEvent
    .subscribe((contactsList: Contact[]) => {
      this.contacts = contactsList;
    });

    //get contact list
    this.contacts=this.contactService.getContacts();
  }

  onSelected(contact: Contact){
    this.contactService.contactSelectedEvent.emit(contact);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
