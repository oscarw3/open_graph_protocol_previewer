import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import templateString from './previewer.component.html';


@Component({
  selector: 'previewer',
  template: templateString,
})
export class PreviewerComponent {
  status = 'Not Started';
  constructor(private http: HttpClient){}  

  processImage() {
    console.log("hi start processing...");
    this.http.post('open_graph_previewer/start_processing', {"url": "https://linkedin.com/"}).subscribe(data => {
      this.status = data['text'];
    });    
  }
}
