/* model for a race returned from the Cabici API */

export class Race {

  constructor(
    public id: number,
    public url: string,
    public club: {name: string, id: number, slug: string},
    public location: {id: number, name: string, shortname: string, location: string},
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
    public licencereq: { key: string, display: string },
    public grades: string
  ) { }
}
