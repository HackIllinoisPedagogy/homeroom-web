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
        this.startTime = firebase.firestore.Timestamp
    }


}