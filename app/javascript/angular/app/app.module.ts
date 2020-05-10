import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { PreviewerComponent } from './previewer.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PreviewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [PreviewerComponent]
})
export class AppModule { }
