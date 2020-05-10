import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import templateString from './previewer.component.html';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'previewer',
  template: templateString,
})
export class PreviewerComponent implements OnInit, OnDestroy {
  url = '';
  processing = false;
  previewerForm: FormGroup;
  subscription: Subscription;
  sessionID: string;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cableService: ActionCableService,
  ) {
    this.previewerForm = this.formBuilder.group({
      url: '',
    });
  }

  ngOnInit() {
    this.sessionID = '1234';
    // Open a connection and obtain a reference to the channel
    const channel: Channel = this.cableService
      .cable('ws://localhost:5000/cable')
      .channel('WebPageMetadataChannel', {session_id: this.sessionID});
    console.log(channel);
    // // Subscribe to incoming messages
    this.subscription = channel.received().subscribe(metadata => {
        console.log("message received");
        console.log(metadata);
    });
  }

  ngOnDestroy() {
    // Unsubscribing from the messages Observable automatically
    // unsubscribes from the ActionCable channel as well
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const postParams = this.previewerForm.value
    postParams['session_id'] = this.sessionID
    this.http.post('open_graph_previewer/start_processing', postParams).subscribe(data => {
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
