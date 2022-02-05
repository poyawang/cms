import { Component, Input, OnInit, Output } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from "../message.service"

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    // new Message(1, "hello there", "random text", "Anna"),
    // new Message(2, "another one", "here you go", "Fendy"),
    // new Message(3, "hola", "here here", "Eli")
  ]
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {

    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });

    this.messages = this.messageService.getMessages();
  }

  onAddMessage(message: Message){
    // this.messages.push(message);
  }
}
