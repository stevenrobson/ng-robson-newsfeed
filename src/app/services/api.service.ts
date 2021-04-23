import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Favorite } from '../shared/favorite';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';

const apiServer = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  GetUser(userId: number): Observable<User> {
    return this.http.get<User>(`${apiServer}/users/${userId}`);
  }

  GetAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${apiServer}/users`);
  }

  GetUserFeeds(userId: number): Observable<Feed[]> {
    return this.http.get<Feed[]>(`${apiServer}/feeds?userId=${userId}`);
  }

  GetAllFeeds(): Observable<Feed[]> {
    return this.http.get<Feed[]>(`${apiServer}/feeds`);
  }

  GetUserFavorites(userId: number): Observable<Favorite[]> {
    let faves = this.http.get<Favorite[]>(`${apiServer}/favorites?userId=${userId}`);
    return faves;
  }
}
