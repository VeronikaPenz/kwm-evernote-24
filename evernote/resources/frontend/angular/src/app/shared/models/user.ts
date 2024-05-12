export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public role: string,
    public profilepic?: string,
  ) {
  }

  static empty(): User {
    return new User(0, '', '', 'user');
  }
}
