/* model for a race returned from the Cabici API */

export class Race {

  constructor(
    public id: number,
    public url: string,
    public club: Object,
    public location: Object,
    public title: string,
    public date: string,
    public signontime: string,
    public starttime: string,
    public website: string,
    public status: string,
    public description: string,
    public officials: Object,
    public discipline: { key: string, display: string },
    public category: { key: string, display: string },
    public licencereq: { key: string, display: string }
  ) { }
}
