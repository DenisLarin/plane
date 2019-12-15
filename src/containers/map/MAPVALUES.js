export default class MAPVALUES {
    static map = null;
    static getMap(){
        return this.map ? this.map : null;
    }
    static setMap(map){
        this.map = map;
    }
}