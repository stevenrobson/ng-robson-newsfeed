import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Feed } from '../shared/feed';
import { User } from '../shared/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() user?: Observable<User>;
  @Input() allUsers?: Observable<User[]>;
  @Output() feeds: Observable<Feed>;

  constructor() { }

  ngOnInit(): void {
  }

}
