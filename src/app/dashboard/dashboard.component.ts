import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import { Favorite } from '../shared/favorite';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Output() user?: Observable<User>;
  @Output() allUsers?: Observable<User[]>;
  @ViewChild('drawer') drawer: MatSidenav;

  isHandset = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logonUserId: number;
  logonUser$: Observable<User>;
  allFeeds$: Observable<Feed[]>;
  allUsers$: Observable<User[]>;
  selectedUserFeed$: Observable<Feed[]>;
  selectedUser$: Observable<User>;
  showAllFeeds = true; // default to showing all feeds
  subscriptionAllFeeds: Subscription;

  constructor(private api: ApiService, private data: DataService, private breakpointObserver: BreakpointObserver) {
    this.logonUserId = this.data.logonUserId;
    this.selectUser(this.logonUserId);
    this.initializeGlobals();
    this.isHandset$.subscribe(handset => this.isHandset = handset);
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscriptionAllFeeds.unsubscribe();
  }

  initializeGlobals(): void {
    this.selectAllUsers();
    this.selectAllFeeds();
    this.logonUser$ = this.data.logonUser$;
    this.selectedUser$ = this.data.selectedUser$;
    this.allUsers$ = this.data.allUsers$;
    this.allFeeds$ = this.data.allFeeds$;
  }

  selectAllUsers(): void {
    this.data.clearSelectedUser();
    this.showAllFeeds = true;
    let users: User[];
    let feeds: Feed[];
    let favorites: Favorite[];

    // todo: refactor
    this.api.GetAllUsers().subscribe(usrs => users = usrs,
      (error: Error) => console.warn(error),
      () => {
        users.forEach(user => {
          this.api.GetUserFeeds(user.id).subscribe(feds => feeds = feds,
            (error: Error) => console.warn(error),
            () => {
              user.feeds = feeds;
              this.api.GetUserFavorites(user.id).subscribe(faves => favorites = faves,
                (error: Error) => console.warn(error),
                () => {
                  user.favorites = favorites;
                  if (user.id === this.data.logonUserId) {
                    this.data.setLogonUser(user);
                    this.data.setLogonUserFavorites(favorites);
                  };
                }
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
    this.api.GetAllFeeds().subscribe(feeds => this.data.setAllFeeds(feeds));
  }

  selectUser(id: number): void {
    this.showAllFeeds = false;
    let user: User;
    let feeds: Feed[];
    let favorites: Favorite[];

    // todo: refactor
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
