import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { PreviewerComponent } from './previewer.component';

@NgModule({
  declarations: [
    PreviewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [PreviewerComponent]
})
export class AppModule { }
