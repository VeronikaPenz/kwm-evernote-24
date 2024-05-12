import {Todo} from "./todo";
import {Tag} from "./tag";

export class Note {
  constructor(
    public id: number,
    public text: string,
    public important: boolean,
    public title?: string,
    public image?: string,
    public todos?: Todo[],
    public tags?: Tag[],
  ) {
  }

  static empty(): Note {
    return new Note(0, '', false);
  }

  static fromSource(data: any): Note {
    return new Note(
      data.id,
      data.text,
      data.important == 1,
      data.title,
      data.image,
      data.todos ? data.todos.map((t: Todo) => Todo.fromSource(t)) : undefined,
      data.tags,
    )
  }
}