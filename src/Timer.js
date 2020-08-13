import * as firebase from "firebase";

class Timer {
    startTime;
    endTime;
    constructor() {
        this.startTime = null;
        this.endTime = null;
    }

    getStart() {
        return this.startTime;
    }

    getEnd() {
        return this.endTime;
    }

    start() {
        this.startTime = firebase.firestore.Timestamp.fromDate(new Date());
    }

    end() {
        this.endTime = firebase.firestore.Timestamp.fromDate(new Date());
    }


}

export default Timer;