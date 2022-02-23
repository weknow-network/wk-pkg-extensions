import { IKeyValue, IKeyValueDefault } from "@weknow-network/wk-pkg-primitives";
import { IRecordConvert } from "./IRecordConvert";

/**
 * Common record conversion
 */
export const RecordConvert: IRecordConvert = {
  /**
   * convert record to Map
   */
  toMap: <TValue>(record: Record<string, TValue>): Map<string, TValue> => {
    return Object.keys(record).reduce((map, k) => {
      const v: TValue = record[k];
      map.set(k, v);
      return map;
    }, new Map<string, TValue>());
  },

  /**
   * convert record to key-value array
   */
  toKeyValueArray: <TValue>(
    record: Record<string, TValue>
  ): IKeyValue<string, TValue>[] => {
    return Object.keys(record).map((key) => {
      return { key, value: record[key] };
    });
  },

  /**
   * convert record to key-value array
   */
  toKeyValueDefaultArray: (
    record: Record<string, string[]>
  ): IKeyValueDefault[] => {
    return Object.keys(record).map((key) => {
      return { key, value: record[key] };
    });
  },
};
