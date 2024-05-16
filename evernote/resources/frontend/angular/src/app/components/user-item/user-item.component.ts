import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {User} from "../../shared/models/user";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'en-user-item',
  standalone: true,
  imports: [
    NgIf,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss'
})
export class UserItemComponent {
  @Input() user?: User
  @Input() tiny: boolean = false
  @Input() shared: boolean = false
  @Output() removeShare = new EventEmitter();

  showUnshare = false;

  unshare() {
    this.showUnshare = false;
    this.removeShare.emit()
  }
}
