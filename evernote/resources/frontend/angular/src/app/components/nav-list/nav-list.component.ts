import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'en-nav-list',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive

  ],
  templateUrl: './nav-list.component.html',
  styleUrl: './nav-list.component.scss'
})
export class NavListComponent {

}
