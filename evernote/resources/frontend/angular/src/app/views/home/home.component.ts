import {Component, OnInit} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {MessageService} from "primeng/api";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {UserItemComponent} from "../../components/user-item/user-item.component";

@Component({
  selector: 'en-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    UserItemComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(public us: UserService,
              private ms: MessageService
  ) {
  }

  async ngOnInit() {
    await this.us.updateCurrentUser(this.ms, true);
  }
}
