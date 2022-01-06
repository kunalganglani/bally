import { performance } from "perf_hooks";
import { inputData } from "./Input.js";

const transformSlateEvents = (slateEvents) =>
  slateEvents.map((slateItem) => ({
    event: {
      ...slateItem,
    },
    isSlate: true,
  }));
const transformSportingData = (sportingEvents) =>
  Object.values(sportingEvents).map((item) => ({
    event: item,
    isSlate: false,
  }));
const transformGroups = (groupedEvents) => {
  const resultGroups = [];
  Object.keys(groupedEvents).forEach((groupedEventItemKey) => {
    const groupedEventItem = groupedEvents[groupedEventItemKey];
    if (groupedEventItem.length > 1) {
      resultGroups.push({
        event: groupedEventItem.map((item) => item.event),
        isSlate: groupedEventItem[groupedEventItem.length - 1].isSlate,
      });
    } else {
      resultGroups.push(groupedEventItem[0]);
    }
  });
  return resultGroups;
};

export const groupByKey = (arr, parentKey, key1, key2) => {
  const map = {};
  for (let i = 0; i < arr.length; i += 1) {
    const uniqueKey = `${arr[i][parentKey][key1]}${arr[i][parentKey][key2]}`;
    if (!map[uniqueKey]) {
      map[uniqueKey] = [arr[i]];
    } else {
      map[uniqueKey].push(arr[i]);
    }
  }
  return map;
};

export const unionEventData = ({ data }) => {
  const t0 = performance.now();
  const allEvent = [
    ...transformSlateEvents(data.slate_events),
    ...transformSportingData(data.sporting_events),
    // ...[
    //   transformSportingData(data.sporting_events)[0],
    //   transformSportingData(data.sporting_events)[1],
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
