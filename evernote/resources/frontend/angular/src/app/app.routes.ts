import { Routes } from '@angular/router';
import {HomeComponent} from "./views/home/home.component";
import {LoginComponent} from "./views/login/login.component";
import {NotesComponent} from "./views/notes/notes.component";
import {ListsComponent} from "./views/lists/lists.component";
import {TodosComponent} from "./views/todos/todos.component";
import {SharedComponent} from "./views/shared/shared.component";
import {AssignedComponent} from "./views/assigned/assigned.component";

export const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'lists', component: ListsComponent},
  {path: 'notes', component: NotesComponent},
  {path: 'todos', component: TodosComponent},
  {path: 'shared', component: SharedComponent},
  {path: 'assigned', component: AssignedComponent}
];
