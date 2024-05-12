import {Tag} from "./tag";
import {Share} from "./share";
import {User} from "./user";

export class Todo {
  constructor(
    public id: number,
    public title: string,
    public checked: boolean,
    public description?: string,
    public due_date?: Date,
    public tags?: Tag[],
    public note_id?: number,

    public share?: Share,
    public user?: User,

  ) {
  }

  static empty(): Todo {
    return new Todo(0, '', false, '');
  }

  static fromSource(data: any): Todo {
    return new Todo(
      data.id,
      data.title,
      data.checked === 1,
      data.description,
      data.due_date ? new Date(data.due_date) : undefined,
      data.tags,
      data.note_id,
      data.share,
      data.user,
    )
  }
}
