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
    this.http.get<Message[] >('https://cms-project-3d1c1-default-rtdb.firebaseio.com/messages.json')
      //subscribe to observable returning
      .subscribe(
        //sucess function
        (messages: Message[] ) => {
          //assign the array of documents received to the documents class attribute
          this.messages = messages
          this.maxMessageId = this.getMaxId()
          //sort alphabetically by name
          this.messages.sort((a, b) => (a.id < b.id) ? 1 : (a.id > b.id) ? -1 : 0)
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.log(error);
        }
    )
    return this.messages.slice()
  };


  getMessage(id: string): Message {
    //loop through all the messages
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(newMessage: Message){
    if(!newMessage){
      return;
    }
    this.maxMessageId++
    newMessage.id = this.maxMessageId.toString()
    this.messages.push(newMessage);
    let documentsListClone = this.messages.slice()
    // this.documentListChangedEvent.next(documentsListClone)
    this.storeMessages()
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
