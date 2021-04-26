import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Favorite } from '../shared/favorite';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public logonUserId = 4;

  private logonUser: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  public logonUser$ = this.logonUser.asObservable();

  // refactor out to rely only on logonUserFavorite$ @ line 24
  private logonUserFavorites: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(undefined);
  public logonUserFavorites$ = this.logonUserFavorites.asObservable();

  private logonUserFavorite: BehaviorSubject<Favorite[]> = new BehaviorSubject<Favorite[]>(undefined);
  public logonUserFavorite$ = this.logonUserFavorite.asObservable();

  public loggedOnUser: User;

  private selectedUser: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  public selectedUser$ = this.selectedUser.asObservable();

  private allUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(undefined);
  public allUsers$ = this.allUsers.asObservable();

  private allFeeds: BehaviorSubject<Feed[]> = new BehaviorSubject<Feed[]>(undefined);
  public allFeeds$ = this.allFeeds.asObservable();

  constructor() { }

  getUser(id: number): Observable<User> {
    return this.allUsers$.pipe(
      map(usrs => usrs.find(user => user.id === id)));
  }

  setSelected(user: User): User {
    user = this.processUser(user);
    this.selectedUser.next(user);
    return user;
  }

  setLogonUser(user: User): User {
    user = this.processUser(user);
    this.loggedOnUser = user;
    let faves: any[] = [];
    user.favorites.forEach(fav => { faves.push(fav.feedId); });
    this.logonUserFavorites.next(faves);
    this.logonUser.next(user);
    return user;
  }

  setLogonUserFavorites(favorites: Favorite[]) {
    let faves: number[] = [];
    favorites.forEach(fav => { faves.push(fav.feedId); });
    this.logonUserFavorite.next(favorites);
    this.logonUserFavorites.next(faves);
  }

  getLogonUserFavorites(): Favorite[] {
    return this.logonUserFavorite.getValue();
  }

  setSelectedUser(user: User, feeds: Feed[], favorites: Favorite[]): User {
    user.feeds = feeds;
    user.favorites = favorites;
    user = this.processUser(user);
    this.selectedUser.next(user);
    return user;
  }

  clearSelectedUser(): void {
    this.selectedUser.next(undefined);
  }

  setAllUsers(users: User[]): void {
    this.allUsers.next(users);
  }


  setAllFeeds(feeds: Feed[]): Feed[] {
    feeds.forEach(feed => feed.date = new Date(feed.date));
    feeds = this.sortFeedsByDate(feeds);
    this.allFeeds.next(feeds);
    return feeds;
  }

  public sortFeedsByDate(feeds: Feed[]): Feed[] {
    feeds = feeds.sort((a: Feed, b: Feed) => {
      return a.date.getTime() - b.date.getTime();
    });
    return feeds;
  }

  public processUser(user: User): User {
    // convert date strings to dates, flag favorites,
    user.feeds = this.processFeeds(user.feeds, user.favorites);

    // default sort by date
    user.feeds = this.sortFeedsByDate(user.feeds);

    return user;
  }

  public processFeeds(feeds: Feed[], favorites?: Favorite[]): Feed[] {
    feeds.forEach(feed => {

      // convert strings to dates for proper sortability
      feed.date = new Date(feed.date);

      // flag feed.favorite if feed in favorite[]
      if (favorites) {
        favorites.forEach(faves => {
          if (faves.feedId === feed.id)
            feed.favorite = true;
        })
      }
    });
    return feeds;
  }

}
