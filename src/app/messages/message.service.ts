import { Injectable, EventEmitter } from '@angular/core';
import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageSelectedEvent = new EventEmitter<Message>();
  messageChangedEvent = new EventEmitter<Message[]>();

  messages: Message[]= [];

  getMessages() {
    return this.messages.slice()
  };


  getMessage(id: string): Message{
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
