import { LS_KEY } from "./constants";

export const resetLS = () => {
  if (window) {
    window.localStorage.removeItem(LS_KEY);
  }
};

export const markToLS = (id: string) => {
  if (window) {
    const lsRecord = window.localStorage.getItem(LS_KEY);

    if (lsRecord) {
      try {
        const lsRecordArray = lsRecord.split(",");
        if (!lsRecordArray.includes(id)) {
          lsRecordArray.push(id);
          window.localStorage.setItem(LS_KEY, lsRecordArray.join(","));
        }
      } catch (e: unknown) {
        console.error(e);
        throw new Error("Local storage Error!");
      }
    } else {
      window.localStorage.setItem(LS_KEY, id);
    }
  }
};

export const getViewedIds = (): string[] => {
  if (window) {
    const lsRecord = window.localStorage.getItem(LS_KEY);
    if (lsRecord) {
      try {
        const lsRecordArray = lsRecord.split(",");
        return lsRecordArray;
      } catch (e: unknown) {
        console.error(e);
        throw new Error("Local storage Error!");
      }
    }
  }
  return [];
};
