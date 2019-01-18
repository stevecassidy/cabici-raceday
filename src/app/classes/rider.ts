
/* Rider class mirrors the structure of the JSON data returned
   from the cabici.net API
 */
export class Rider {

    constructor(
        public id?: string,
        public first_name?: string,
        public last_name?: string,
        public club?: string,
        public clubslug?: string,
        public licenceno: string = '',
        public classification: string = 'unknown',
        public member_category?: string,
        public member_date: string = '',  /* really a date */
        public grades: object = null,
        public gender?: string,
        public emergencyphone?: string,
        public emergencyname?: string,
        public dob: string = '',
        public phone: string = '',
        public email: string = ''
    ) { }

    static isFinancial(r: Rider): boolean {
      const mdate = Date.parse(r.member_date);
      const now = new Date().valueOf();
      return mdate >= now;
    }

    // find the usual grade for a rider with a club, '' if not present
    static usualGrade(rider: Rider, clubslug: string): string {
      const grade = rider.grades[clubslug];
      if (grade) {
        return grade;
      } else {
        return '';
      }
    }
}


