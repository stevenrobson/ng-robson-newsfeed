import { HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'UpkeyNewsfeed';

  httpStatus: number;
  httpResponseBase: Observable<HttpResponse<object>>;

  constructor(private api: ApiService) {

    this.httpResponseBase = this.api.GetServiceState();

  }

}
