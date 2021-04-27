import { HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'UpkeyNewsfeed';

  private serverStatus: BehaviorSubject<HttpResponse<Object>> = new BehaviorSubject<HttpResponse<Object>>(null);
  public serverStatus$ = this.serverStatus.asObservable();
  httpStatusCode: Observable<HttpResponse<Object>>;
  httpStatus: HttpResponse<Object>;

  constructor(private api: ApiService) {

    // this.api.GetServiceState().subscribe(status =>
    //   this.httpStatus = status,
    //   (error: Error) => { console.warn(error) },
    //   () => {console.log('server status', this.httpStatus); this.serverStatus.next(this.httpStatus)}
    // );

    this.httpStatusCode = this.api.GetServiceState();

  }

}
