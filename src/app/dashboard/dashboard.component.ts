import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import { Favorite } from '../shared/favorite';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Output() user?: Observable<User>;
  @Output() allUsers?: Observable<User[]>;

  logonUserId: number = 4;
  allFeeds$: Observable<Feed[]>;
  allUsers$: Observable<User[]>;
  selectedUserFeed$: Observable<Feed[]>;
  selectedUser$: Observable<User>;
  showAllFeeds = false;

  constructor(private api: ApiService, private data: DataService) {
    this.selectUser(this.logonUserId);
    this.initializeGlobals();
    this.allUsers$ = this.data.allUsers$;
    this.allUsers = this.data.allUsers$;
    this.selectedUser$ = this.data.selectedUser$;

    this.user = this.data.selectedUser$;
  }

  ngOnInit(): void { }

  initializeGlobals(): void {
    this.api.GetAllFeeds().subscribe(feeds => this.data.setAllFeeds(feeds));
    this.selectAllUsers();
  }

  selectAllUsers(): void {
    console.log('selectAllUsers()');
    this.showAllFeeds = true;
    let users: User[];
    let feeds: Feed[];
    let favorites: Favorite[];
    this.api.GetAllUsers().subscribe(usrs =>
      { users = usrs },
      (error: Error) => console.warn(error),
      () => {
        // console.log('users',users)
        users.forEach(user => {
          this.api.GetUserFeeds(user.id).subscribe(feds =>
            feeds = feds,
            (error: Error) => console.warn(error),
            () => {
              user.feeds = feeds;
              this.api.GetUserFavorites(user.id).subscribe(faves =>
                favorites = faves,
                (error: Error) => console.warn(error),
                () => user.favorites = favorites
              )
            }
          )
        });
        this.data.setAllUsers(users);
      }
    );

  }

  selectAllFeeds(): void {
    this.showAllFeeds = true;
  }

  selectUser(id: number): void {
    this.showAllFeeds = false;

    let user: User;
    let feeds: Feed[];
    let favorites: Favorite[];

    this.api.GetUser(id).subscribe(usr =>
      user = usr,
      (error: Error) => console.warn('selectUser -> GetUser error', error),
      () => {
        this.api.GetUserFeeds(id).subscribe(feds =>
          feeds = feds,
          (error: Error) => console.warn('selectUser -> GetUser -> GetUserFeeds error', error),
          () => {
            this.api.GetUserFavorites(id).subscribe(faves =>
              favorites = faves,
              (error: Error) => console.warn('selectUser -> GetUser -> GetUserFeeds -> GetFaves error', error),
              () => {
                this.data.setSelectedUser(user, feeds, favorites);
              }
            )
          }
        )
      }
    );

  }



}
