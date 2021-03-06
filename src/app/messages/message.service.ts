import { Injectable, EventEmitter } from '@angular/core';
import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageSelectedEvent = new EventEmitter<Message>();
  messageChangedEvent = new EventEmitter<Message[]>();

  messageListChangedEvent = new Subject<Message[]>();

  // messages: Message[]= [];
  messages: Message[] =[];

  maxMessageId : number;s

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

  getMessages() {
    //use http get
    this.http.get<{ message: string, messages: Message[] }>('http://localhost:3000/messages')
      //subscribe to observable returning
      .subscribe(
        //sucess function
        (messagesData) => {
          //assign the array of contacts received to the contacts class attribute
          this.messages = messagesData.messages;
          //sort alphabetically by name
          this.messages.sort((a, b) => (a.id < b.id) ? 1 : (a.id > b.id) ? -1 : 0)
          //signal that the list has changed
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.log(error);
        }
      )
  }



  getMessage(id: string): Message {
    //loop through all the messages
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(newMessage: Message) {
    //check if message is defined
    if (!newMessage) {
      //exit
      return;
    }

    //set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //convert object to string to send on request
    newMessage.id = '';
    const strMessage = JSON.stringify(newMessage);

    //send request with object and headers
    this.http.post('http://localhost:3000/messages', strMessage, { headers: headers })
      //subscribe to response
      .subscribe(
        (messages: Message[]) => {
          //assign messages list
          this.messages = messages;
          //emit change
          this.messageListChangedEvent.next(this.messages.slice());
        });
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  storeMessages() {
    //stringify the list of documnts
    let messages = JSON.stringify(this.messages);

    //create header for content type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //put method with url, documents object to replace, and headers
    this.http.put('https://cms-project-3d1c1-default-rtdb.firebaseio.com/messages.json', messages, { headers: headers })
      //subscribe to response
      .subscribe(
        () => {
          //once a response has been received, signal that the document list has changed, send copy of list
          this.messageListChangedEvent.next(this.messages.slice());
        }
      )
  }

}
