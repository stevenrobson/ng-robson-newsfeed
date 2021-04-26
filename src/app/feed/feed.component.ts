import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import { Favorite } from '../shared/favorite';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  @Input() feed: Feed;
  @Input() userOut: User;

  pic = '';
  logonUserId: number;
  logonUser: User;
  logonUserFavorites$: Observable<number[]>;

  constructor(private api: ApiService, private data: DataService) {
    this.logonUserId = this.data.logonUserId;
    this.logonUser = this.data.loggedOnUser;
    this.logonUserFavorites$ = this.data.logonUserFavorites$;
  }

  setDefaultPic() {
    this.pic = "../assets/images/_steve.png";
  }

  ngOnInit(): void {
  }

  shareFeed(feed: Feed) {
    alert(`Insert share logic for feed ${feed.id} titled ${feed.title} here`);
  }

  clickLike(feedId: number) {
    console.log('LIKE', feedId);
    this.api.PostUserFavorite(this.logonUserId, feedId).subscribe(
      result => console.log(result),
      (e: Error) => console.log('error', e),
      () => this.updateLoggonUserFavorites()
    )
  }

  clickUnlike(feedId: number) {
    let favorite: Favorite;
    this.data.getLogonUserFavorites().forEach(fav => {if(fav.feedId === feedId) favorite = fav})
    this.api.DeleteUserFavorite(favorite).subscribe(
      result => console.log(result),
      (e: Error) => console.log('error', e),
      () => this.updateLoggonUserFavorites()
    )
  }

  updateLoggonUserFavorites(): void {
    this.api.GetUserFavorites(this.logonUserId).subscribe(
      results => this.data.setLogonUserFavorites(results));
  }

}
