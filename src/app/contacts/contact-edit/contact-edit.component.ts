import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  hasGroup:boolean = false;
  id: string;

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params) => {
      let id = params['id']
      if (!id) {
        this.editMode = false;
        return
      }

      this.originalContact = this.contactService.getContact(id)

      if(!this.originalContact){
        return
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.contact.group !== null && this.contact.group !== undefined) {
        //set has group to true
        this.hasGroup = true;
        this.groupContacts = [...this.contact.group];
      }

    })
  }

  onSubmit(form:NgForm){
    let value = form.value
    let newContact = new Contact(null, value.name, value.email, value.phone, value.imageUrl, null)

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact)
    } else {
      this.contactService.addContact(newContact)
    }

    this.router.navigate(['/contacts'], {relativeTo: this.route})
  }

  onCancel(){
    this.router.navigate(['/contacts'], {relativeTo: this.route})
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {// newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
       return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
       if (newContact.id === this.groupContacts[i].id) {
         return true;
      }
    }
    return false;
 }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
      return;
    }
    this.groupContacts.push(selectedContact);
  }


  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }



}
