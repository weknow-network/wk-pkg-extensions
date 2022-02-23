import { IKeyValue, IKeyValueDefault } from "@weknow-network/wk-pkg-primitives";

/**
 * Common record conversion
 */
export interface IRecordConvert {
  /**
   * convert record to Map
   */
  toMap<TValue>(record: Record<string, TValue>): Map<string, TValue>;

  /**
   * convert record to key-value array
   */
  toKeyValueArray<TValue>(
    record: Record<string, TValue>
  ): IKeyValue<string, TValue>[];

  /**
   * convert record to key-value array
   */
  toKeyValueDefaultArray(record: Record<string, string[]>): IKeyValueDefault[];
}
