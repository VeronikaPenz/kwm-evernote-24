import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../shared/models/user";
import {MessageService} from "primeng/api";
import {UserService} from "../../shared/services/user.service";
import {RadioButtonModule} from "primeng/radiobutton";
import {FormsModule} from "@angular/forms";
import {UserItemComponent} from "../user-item/user-item.component";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
  selector: 'en-share-box',
  standalone: true,
  imports: [
    RadioButtonModule,
    FormsModule,
    UserItemComponent,
    ButtonModule,
    NgIf
  ],
  templateUrl: './share-box.component.html',
  styleUrl: './share-box.component.scss'
})
export class ShareBoxComponent implements OnInit {
  @Input() exclude: number[] = [];
  @Output() cancel = new EventEmitter();
  @Output() share = new EventEmitter<number>();
  user: number = -1;
  users?: User[];
  currentUser: string | null = null;

  constructor(private ms: MessageService,
              private us: UserService,
              private auth: AuthenticationService) {
  }

  async ngOnInit() {
    try {
      this.currentUser = await this.auth.checkUserStatus();
      this.users = await this.us.getAll();
    } catch (e) {
      console.error('API error:', e);
      this.ms.add({
        severity: 'error',
        summary: 'Failed to fetch users',
        detail: 'Please reload page and try again.',
      });
    }
  }

}
