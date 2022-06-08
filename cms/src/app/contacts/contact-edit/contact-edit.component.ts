import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {

  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  isAddingInvalid: boolean = false;

  constructor(private contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
          this.id = params['id'];
          if (!this.id) {
            this.editMode = false;
            return;
          }

          this.originalContact = this.contactService.getContact(this.id);

          if (!this.originalContact) {
            return;
          }

          this.editMode = true;
          this.contact = JSON.parse(JSON.stringify(this.originalContact));

          if (this.contact.group) {
            this.groupContacts = [...this.contact.group];
          }
      }
    );
  }

  onSubmit(form: NgForm) {
    let value = form.value;
    let newContact = new Contact(value.id, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigateByUrl('/contacts');
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }

    this.groupContacts.splice(index, 1);
  }

  onCancel() {
    this.router.navigateByUrl('/contacts');
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }

    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }

    for (let contact of this.groupContacts) {
      if (newContact.id === contact.id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    
    if (invalidGroupContact) {
      this.isAddingInvalid = true;
      return;
    }

    this.groupContacts.push(selectedContact);
    this.isAddingInvalid = false;
  }
}
