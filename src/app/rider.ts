import { Club } from './club';
import { ClubList } from './club-list';

export class Rider {

    constructor(
        public id: number,
        public username: string,
        public firstName: string,
        public lastName: string,
        public club: number,
    ) { }

    public fullName() {
        return this.firstName + ' ' + this.lastName;
    }

    public getClub() {
        var clubs = ClubList.clubs();
        for (var i=0; i < clubs.length; i++) {
            if (clubs[i].id === this.club) {
                return clubs[i];
            }
        }
        // if no clubs match
        return null;
    }
}