import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
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

  constructor() {
  }

  ngOnInit(): void {
  }

}
