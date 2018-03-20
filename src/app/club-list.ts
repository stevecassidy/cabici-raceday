import { Club } from './club';

export class ClubList {
    static list = [
        { "name": "AG2R LA MONDIALE", "id": 73, "slug": "ALM" },
        { "name": "ASTANA PRO TEAM", "id": 65, "slug": "AST" },
        { "name": "BMC RACING TEAM", "id": 68, "slug": "BMC" },
        { "name": "ETIXX - QUICK STEP", "id": 72, "slug": "EQS" },
        { "name": "FDJ", "id": 70, "slug": "FDJ" },
        { "name": "IAM CYCLING", "id": 79, "slug": "IAM" },
        { "name": "LAMPRE - MERIDA", "id": 69, "slug": "LAM" },
        { "name": "LOTTO SOUDAL", "id": 76, "slug": "LTS" },
        { "name": "MOVISTAR TEAM", "id": 63, "slug": "MOV" },
        { "name": "ORICA GREENEDGE", "id": 74, "slug": "OGE" },
        { "name": "TEAM CANNONDALE - GARMIN", "id": 78, "slug": "TCG" },
        { "name": "TEAM GIANT - ALPECIN", "id": 71, "slug": "TGA" },
        { "name": "TEAM KATUSHA", "id": 64, "slug": "KAT" },
        { "name": "TEAM LOTTO NL - JUMBO", "id": 77, "slug": "TLJ" },
        { "name": "TEAM SKY", "id": 66, "slug": "SKY" },
        { "name": "TINKOFF - SAXO", "id": 67, "slug": "TCS" },
        { "name": "TREK FACTORY RACING", "id": 75, "slug": "TFR" },
    ];
    static clubs() {
        var clubs = [];
        for (var i=0; i < this.list.length; i++) {
            var club = new Club(this.list[i].id, this.list[i].name, this.list[i].slug);
            clubs.push(club);
        }
        return clubs;
    }
}
