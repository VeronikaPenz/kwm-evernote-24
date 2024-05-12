import {List} from "./list";
import {Todo} from "./todo";
import {User} from "./user";

export class Share {
  constructor(
    public id: number,
    public user_id: number,
    public list_id: number,
    public list: List,
    public assignments: Todo[],
    public user?: User,
  ) {
  }
}