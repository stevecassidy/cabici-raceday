export class User {
  constructor (
    public token: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    public club: string,
    public official: boolean
  ) {};
}
