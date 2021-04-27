import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Favorite } from '../shared/favorite';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';

const apiServer = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.httpHeaders = new HttpHeaders().set(
      "Authorization", this.getAuth0()
    )
  }

  getAuth0(): string {
    return 'kjsdhfkjlsdahfjklshadlkjfhsadgf';
  }

  GetServiceState(): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>(`${apiServer}/users`, {observe: 'response'});
  }

  GetUser(userId: number): Observable<User> {
    return this.http.get<User>(`${apiServer}/users/${userId}`, {headers:this.httpHeaders});
  }

  GetAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${apiServer}/users`, {headers:this.httpHeaders});
  }

  GetUserFeeds(userId: number): Observable<Feed[]> {
    return this.http.get<Feed[]>(`${apiServer}/feeds?userId=${userId}`, {headers:this.httpHeaders});
  }

  GetAllFeeds(): Observable<Feed[]> {
    return this.http.get<Feed[]>(`${apiServer}/feeds`, {headers:this.httpHeaders});
  }

  GetUserFavorites(userId: number): Observable<Favorite[]> {
    let faves = this.http.get<Favorite[]>(`${apiServer}/favorites?userId=${userId}`, {headers:this.httpHeaders});
    return faves;
  }

  PostUserFavorite(userId: number, feedId: number): Observable<Favorite> {
    const body = JSON.stringify(
      {
        userId: userId as number,
        feedId: feedId as number,
        active: true as boolean
      }
    );

    const httpOptions = {
      headers: new HttpHeaders({
        token: 'some_token',
        'Content-Type': 'application/json',
        "Authorization": this.getAuth0()
      })
    }

    console.log(`POSTING ${apiServer}/favorites`, body)
    return this.http.post<Favorite>('http://localhost:3000/favorites', body, httpOptions);
  }

  DeleteUserFavorite(favorite: Favorite): Observable<Favorite> {
    let id = favorite.id;

    const httpOptions = {
      headers: new HttpHeaders({
        token: 'some_token',
        'Content-Type': 'application/json',
        "Authorization": this.getAuth0()
      })
    }

    return this.http.delete<Favorite>(`${apiServer}/favorites/${id}`, httpOptions);
  }

}
