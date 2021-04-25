import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import { Favorite } from '../shared/favorite';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';
import { UserComponent } from '../user/user.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Output() user?: Observable<User>;
  @Output() allUsers?: Observable<User[]>;
  @ViewChild('drawer') drawer: MatSidenav;

  isHandset = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  logonUserId: number = 4;
  allFeeds$: Observable<Feed[]>;
  allUsers$: Observable<User[]>;
  selectedUserFeed$: Observable<Feed[]>;
  selectedUser$: Observable<User>;
  showAllFeeds = false;

  constructor(private api: ApiService, private data: DataService, private breakpointObserver: BreakpointObserver) {
    this.selectUser(this.logonUserId);
    this.initializeGlobals();
    this.allUsers$ = this.data.allUsers$;
    this.allUsers = this.data.allUsers$;
    this.selectedUser$ = this.data.selectedUser$;
    this.isHandset$.subscribe( handset => this.isHandset = handset);

    this.user = this.data.selectedUser$;
  }

  ngOnInit(): void { }

  initializeGlobals(): void {
    this.api.GetAllFeeds().subscribe(feeds => this.data.setAllFeeds(feeds));
    this.selectAllUsers();
  }

  selectAllUsers(): void {
    this.data.clearSelectedUser();
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
    // this.data.clearSelectedUser();
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

    console.log('drawer',this.drawer);

  }



}
