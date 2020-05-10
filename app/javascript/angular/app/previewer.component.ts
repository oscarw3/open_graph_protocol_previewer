import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import templateString from './previewer.component.html';

@Component({
  selector: 'previewer',
  template: templateString,
})
export class PreviewerComponent {
  url = '';
  processing = false;
  previewerForm;
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {
    this.previewerForm = this.formBuilder.group({
      url: '',
    });
  }  

  onSubmit() {
    this.http.post('open_graph_previewer/start_processing', this.previewerForm.value).subscribe(data => {
      if (data['status'] != 200) {
        console.log("I'm an error");
        return;
      }
      console.log("processing...");
      this.processing = true;
      this.url = this.previewerForm.value['url'];
    });    
  }
}
