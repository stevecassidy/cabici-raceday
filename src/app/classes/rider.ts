
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
        public grades?: object,
        public gender?: string,
        public emergencyphone?: string,
        public emergencyname?: string
    ) { }

}
