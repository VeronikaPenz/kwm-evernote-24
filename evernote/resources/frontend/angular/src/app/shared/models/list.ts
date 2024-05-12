import {Share} from "./share";
import {Note} from "./note";
import {User} from "./user";

export class List {
  constructor(
    public id: number,
    public title: string,
    public description?: string,
    public shares?: Share[],
    public notes?: Note[],
    public user?: User,
  ) {
  }

  static empty(): List {
    return new List(0, '', '');
  }

  static fromSource(data: any): List {
    return new List(
      data.id,
      data.title,
      data.description,
      data.shares,
      data.notes ? data.notes.map((n: Note) => Note.fromSource(n)) : undefined,
      data.user
    )
  }

}
