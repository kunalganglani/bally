interface EventInputInterface {
    games: Array<any>,
    gameidx: Object | null,
    sporting_events: Object,
    slate_events: Array<any>,
    userData: Object | null,
}

export interface InputDataInterface {
    status: String,
    data: EventInputInterface,
    sts: Number,
};
