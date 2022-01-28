import { Component, OnInit, Input } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  @Input() document: Document;

  documents: Document[] = [
    new Document('1', 'test1', 'this is test1', 'test1', null),
    new Document('2', 'test2', 'this is test2', 'test2', null),
    new Document('3', 'test3', 'this is test3', 'test3', null),
    new Document('4', 'test4', 'this is test4', 'test4', null),
    new Document('5', 'test5', 'this is test5', 'test5', null),

  ];

  constructor() { }

  ngOnInit(): void {
  }

}
