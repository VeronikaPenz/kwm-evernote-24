import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {User} from "../../shared/models/user";

@Component({
  selector: 'en-user-item',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss'
})
export class UserItemComponent {
  @Input() user?: User
  @Input() tiny: boolean = false
}
