import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject', { static: false }) subject!: ElementRef;
  @ViewChild('msgText', { static: false }) msgText!: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: string = 'Billy Estella';

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage() {
    let subj = this.subject.nativeElement.value;
    let msgTxt = this.msgText.nativeElement.value;
    let message = new Message("00", subj, msgTxt, this.currentSender);

    this.messageService.addMessage(message);
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }
}
