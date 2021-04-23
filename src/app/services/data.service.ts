import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Favorite } from '../shared/favorite';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private selectedUser: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  public selectedUser$ = this.selectedUser.asObservable();

  private allUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(undefined);
  public allUsers$ = this.allUsers.asObservable();

  private allFeeds: BehaviorSubject<Feed[]> = new BehaviorSubject<Feed[]>(undefined);
  public allFeeds$ = this.allFeeds.asObservable();

  constructor() { }

  setSelectedUser(user: User, feeds: Feed[], favorites: Favorite[]): User {
    user.feeds = feeds;
    user.favorites = favorites;
    user = this.processUser(user);
    this.selectedUser.next(user);
    return user;
  }

  setAllUsers(users: User[]): void {

    users.forEach(user => {
      console.log('setAllUsers', user.id);
      // user = this.processUser(user);
    })

    this.allUsers.next(users);
  }


  setAllFeeds(feeds: Feed[]): Feed[] {
    feeds = this.processFeeds(feeds);
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
    console.log(`processUser: ${user.firstName} ${user.lastName} with ${user.feeds.length} feeds`);

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
