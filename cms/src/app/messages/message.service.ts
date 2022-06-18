import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = [];
    this.maxMessageId = this.getMaxId();
  }

  getMessages(): Message[] {
    this.http
    .get<Message[]>('https://wdd430-cms-a4f31-default-rtdb.firebaseio.com/messages.json')
    .subscribe(
      // success
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();

        let messagesClone = [...this.messages];
        this.messageChangedEvent.next(messagesClone);
      },
      // error
      (error: any) => {
        console.log(error);
      }
    )
    return [...this.messages];
  }

  storeMessages(messages: Message[]): any {
    let messagesJSON = JSON.stringify(messages);
    const httpHeader = new HttpHeaders().set('content-type', 'application/json');

    this.http
      .put<Message[]>(
        'https://wdd430-cms-a4f31-default-rtdb.firebaseio.com/messages.json', 
        messagesJSON,
        { headers: httpHeader})
      .subscribe(() => {
        let messagesClone = [...this.messages];
        this.messageChangedEvent.next(messagesClone);
      }, (error: any) => {
        console.log(error);
      }
    );
  }

  getMessage(id: string): Message{
    return this.messages.find((message) => message.id === id);
  }

  getMaxId(): number {
    let maxId = 0;

    for (let message of this.messages) {
      let currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
    
    this.messages.push(message);
    let messagesClone = [...this.messages];
    // this.messageChangedEvent.emit(messagesClone);
    this.storeMessages(messagesClone);
  }
}