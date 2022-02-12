import { Injectable, EventEmitter } from '@angular/core';
import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageSelectedEvent = new EventEmitter<Message>();
  messageChangedEvent = new EventEmitter<Message[]>();

  // messages: Message[]= [];
  messages: Message[];

  getMessages():Message[] {
    return this.messages.slice()
  };


  getMessage(id: string): Message {
    //loop through all the messages
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(messages: Message){
    this.messages.push(messages);
    this.messageChangedEvent.emit(this.messages.slice());
  }

  constructor() {
    this.messages = MOCKMESSAGES;
  }
}
