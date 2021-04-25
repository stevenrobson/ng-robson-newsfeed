import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../services/data.service';
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
  @Output() userOut?: Observable<User>;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    if(this.user === undefined) {
      this.user = this.data.selectedUser$;
    }
    this.userOut = this.data.selectedUser$;
  }

}
