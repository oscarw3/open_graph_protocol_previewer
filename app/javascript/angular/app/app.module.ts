import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { PreviewerComponent } from './previewer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionCableService } from 'angular2-actioncable';

@NgModule({
  declarations: [
    PreviewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ActionCableService],
  bootstrap: [PreviewerComponent]
})
export class AppModule { }
