// import _ from "lodash";
import { performance } from "perf_hooks";
import { inputData } from "./Input";
import { InputDataInterface } from "./inputDataInterface";

const transformSlateEvents = (slateEvents: Array<Object>) => {
  return slateEvents.map((slateItem: any) => ({
    event: {
      ...slateItem,
    },
    isSlate: true,
  }));
};
const transformSportingData = (sportingEvents: Object) => {
  return Object.values(sportingEvents).map((item) => ({
    event: item,
    isSlate: false,
  }));
};
const transformGroups = (groupedEvents: any) => {
  const resultGroups: any[] = [];
  for (let i in groupedEvents) {
    if (groupedEvents[i].length > 1) {
      resultGroups.push({
        event: groupedEvents[i].map((item: { event: any }) => item.event),
        isSlate: groupedEvents[i][groupedEvents[i].length - 1].isSlate,
      });
    } else {
      resultGroups.push(groupedEvents[i][0]);
    }
  }
  return resultGroups;
};

export const groupByKey = (arr: any, parentKey: any, key1: any, key2: any): object => {
  let map: any = {};
  for (let i = 0; i < arr.length; i++) {
    const uniqueKey = `${arr[i][parentKey][key1]}${arr[i][parentKey][key2]}`;
    if (!map[uniqueKey]) {
      map[uniqueKey] = [arr[i]];
    } else {
      map[uniqueKey].push(arr[i]);
    }
  }
  return map;
};

export const unionEventData = (inputData: InputDataInterface) => {
  const t0 = performance.now();
  const allEvent = [
    ...transformSlateEvents(inputData.data.slate_events),
    ...transformSportingData(inputData.data.sporting_events),
    // ...[
    //   transformSportingData(inputData.data.sporting_events)[0],
    //   transformSportingData(inputData.data.sporting_events)[1],
    // ],
  ].sort((a, b) => a.event.uts - b.event.uts);
  // alternative grouping
  // let groupedEvents = _.groupBy(allEvent, (eventItem:any) => eventItem.event.uts )
  const result = transformGroups(groupByKey(allEvent, "event", "uts", "teams"));
  const t1 = performance.now();
  const perf = `Took, ${(t1 - t0).toFixed(4)} milliseconds to generate results`;
  return [result, perf];
};

console.log(unionEventData(inputData));
