import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-images',
  templateUrl: './drop-images.component.html',
  styleUrls: ['./drop-images.component.scss']
})
export class DropImagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  files: File[] = [];

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

}
