import { Rider } from './rider';

export class Entry {
    constructor(
        public rider: Rider,
        public grade: string = '',
        public number: string = '',
        public place: number = 0,
        public dnf: boolean = false,
        public grade_change: boolean = false
    ) { }
}
