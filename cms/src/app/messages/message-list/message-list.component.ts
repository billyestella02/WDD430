import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  messages: Message[] = [
    {
      id: '1',
      subject: 'Armored Titan',
      msgText: 'I am the Armored Titan',
      sender: 'Reiner Braun'
    },
    {
      id: '2',
      subject: 'Colossal Titan',
      msgText: 'I am the Colossal Titan',
      sender: 'Bertholdt Hoover'
    },
    {
      id: '3',
      subject: 'Female Titan',
      msgText: 'I am the Female Titan',
      sender: 'Annie Leonhart'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
