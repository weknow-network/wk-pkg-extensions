/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extend-native */
/* eslint-disable @typescript-eslint/naming-convention */

import { guardFn, IKeyValue } from "@weknow.network/wk-pkg-primitives";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

type RecordKey = string | number | symbol;

// credits: https://www.itsrainingmani.dev/blog/string-prototype-extension/
declare global {
  interface Array<T> {
    /**
     * convert array to record
     * @param keySelector key of element type of the array which its value will use as a key
     * @param valueSelector optional value selector
     * @example [{ k: "target", v: "a" }, { k: "amount", v: 2 }].toRecord("k", (m) => m.v) = { target: "a", amount: 2 }
     */
    toRecord<K extends keyof T, V = T>(
      keySelector: K,
      valueSelector?: (item: T, index: number) => V
    ): Record<RecordKey, V>;

    /**
     * convert array to record
     * @param keySelector key selector
     * @param valueSelector optional value selector
     * @example [{ k: "target", v: 1 }, { k: "amount", v: 2 }].toRecordMap((m) => m.k, (m) => m.v)
     */
    toRecordMap<K extends RecordKey, V = T>(
      keySelector: (item: T, index: number) => K,
      valueSelector?: (item: T, index: number) => V
    ): Record<K, V>;

    /**
     * convert array of (string, number, symbol) to record (the key will be the values of the array)
     * @param valueSelector optional value selector
     * @example [1, 2, 3].toRecordSelf((m, i) => m * i) = { 1: 0, 2: 2, 3: 6 }
     */
    toRecordSelf<V = T>(
      valueSelector: (item: T, index: number) => V
    ): Record<RecordKey, V>;

    /**
     * combine 2 array without duplication
     * @example [1,2,3].union(2,3,4,5) = [1,2,3,4,5]
     */
    union(array: T[] | T | undefined): T[];

    /**
     * The intersection will give us the elements that both arrays share in
     * commonThe intersection will give us the elements that both arrays share in common.
     * @example [1,2,3].intersect([2,3,4,5]) = [2,3]
     */
    intersect(array: T[] | T): T[];

    /**
     * returns elements of the array which not exists in the argument array.
     * @example [1,2,3,4].except([3,4,5]) = [1,2]
     */
    except(array: T[] | T): T[];

    /**
     * returns the first mapping of an element which don't return undefined.
     * @example [1,2,3,4].findMap(m => m > 2 ? `value is ${m}` : undefined) = 'value is 3'
     */
    findMap<TResult>(
      mapper: (item: T) => TResult | undefined,
      selector?: (item: T) => boolean
    ): TResult | undefined;

    /**
     * convert array to set
     * @example [1, 2, 3, 4].toSet()
     */
    toSet(): Set<T>;

    /**
     * check whether any of the items pass a predicate
     * @example [1, 2, 3, 4].any((m) => m > 2) = true
     */
    any(predicate: (item: T) => boolean): boolean;

    /**
     * check whether all item pass a predicate
     * @example [1, 2, 3, 4].all((m) => m > 2) = false
     */
    all(predicate: (item: T) => boolean): boolean;

    /**
     * convert array to Map<TKey, T[]>
     * @param keySelector determine the key, can be either key of T or selector function
     * @param valueSelector determine the value, can be either key of T or selector function
     *
     * @example [{id: 1, val:'A'}, {id: 2, val:'B'}].toMap('id', 'val') = map { 1: 'A', 2: 'B' }
     */
    toMap<TKey, TValue = T>(
      keySelector: keyof T | ((item: T) => TKey),
      valueSelector?: keyof T | ((item: T) => TValue)
    ): Map<TKey, TValue[]>;

    /**
     * convert array of records to key value array
     * @param keySelector determine the key, can be either key of T or selector function
     * @param valueSelector determine the value, can be either key of T or selector function
     *
     * @example [{ id: 1, val: "A" }, { id: 2, val: "B" }].flatGroup("id", "val") = [{ key: 1, value: "A" }, { key: 2, value: "B" }]
     */
    flatGroup<TKey, TValue = T>(
      keySelector: keyof T | ((item: T) => TKey),
      valueSelector?: keyof T | ((item: T) => TValue)
    ): IKeyValue<TKey, TValue[]>[];
  }
}

export const extendArrayPrototype = () => {
  if (!Array.prototype.toRecord) {
    Array.prototype.toRecord = function <
      T extends { [K in keyof T]: RecordKey }, // added constraint
      K extends keyof T,
      V = T
    >(
      keySelector: K,
      valueSelector?: (item: T, index: number) => V
    ): Record<T[K], V> {
      const empty = {} as Record<T[K], V>;
      return this.reduce<Record<T[K], V>>((acc, item, index) => {
        const k: T[K] = item[keySelector];
        const value = valueSelector ? valueSelector(item, index) : item;
        return { ...acc, [k]: value } as Record<T[K], V>;
      }, empty);
    };
  }

  if (!Array.prototype.toRecordMap) {
    Array.prototype.toRecordMap = function <
      T extends { [K in keyof T]: RecordKey }, // added constraint
      K extends RecordKey,
      V = T
    >(
      keySelector: (item: T, index: number) => K,
      valueSelector?: (item: T, index: number) => V
    ): Record<RecordKey, V> {
      const empty = {} as Record<K, V>;
      return this.reduce<Record<K, V>>((acc, item, index) => {
        const k: K = keySelector(item, index);
        const value = valueSelector ? valueSelector(item, index) : item;
        return { ...acc, [k]: value } as Record<K, V>;
      }, empty);
    };
  }

  if (!Array.prototype.toRecordSelf) {
    Array.prototype.toRecordSelf = function <
      T extends RecordKey, // added constraint
      V = T
    >(valueSelector: (item: T, index: number) => V): Record<T, V> {
      const empty = {} as Record<T, V>;
      return this.reduce<Record<T, V>>((acc, item, index) => {
        const value = valueSelector(item, index);
        return { ...acc, [item]: value } as Record<T, V>;
      }, empty);
    };
  }

  if (!Array.prototype.union) {
    Array.prototype.union = function <T>(value: T[] | T | undefined): T[] {
      if (value === undefined) return this as T[];
      const array = Array.isArray(value) ? value : [value];
      const res = [...new Set<T>([...this, ...array])];
      return res;
    };
  }

  if (!Array.prototype.intersect) {
    Array.prototype.intersect = function <T>(value: T[] | T): T[] {
      const array = Array.isArray(value) ? value : [value];
      const res = this.filter((m) => array.includes(m));
      return res;
    };
  }

  if (!Array.prototype.except) {
    Array.prototype.except = function <T>(value: T[] | T): T[] {
      const array = Array.isArray(value) ? value : [value];
      const res = this.filter((m) => !array.includes(m));
      return res;
    };
  }

  if (!Array.prototype.findMap) {
    Array.prototype.findMap = function <T, TResult>(
      mapper: (item: T) => TResult | undefined,
      selector?: (item: T) => boolean
    ): TResult | undefined {
      let res: TResult | undefined;

      this?.find((item) => {
        if (selector) {
          const r = selector(item);
          if (r) {
            res = mapper(item);
            return true;
          }
          return false;
        }

        const r = mapper(item);
        if (r) {
          res = r;
          return true;
        }
        return false;
      });

      return res;
    };
  }

  if (!Array.prototype.toSet) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Array.prototype.toSet = function (): Set<any> {
      return new Set(this);
    };
  }

  if (!Array.prototype.any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Array.prototype.any = function (
      predicate: (item: any) => boolean
    ): boolean {
      const succeed = this.find((item) => predicate(item));
      return succeed != null;
    };
  }

  if (!Array.prototype.all) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Array.prototype.all = function (
      predicate: (item: any) => boolean
    ): boolean {
      const fail = this.find((item) => !predicate(item)) ?? false;
      return !fail;
    };
  }

  // credit: https://stackoverflow.com/a/47752730/2335067
  if (!Array.prototype.toMap) {
    Array.prototype.toMap = function <TKey, TValue = unknown>(
      keySelector: any | ((item: any) => TKey),
      valueSelector?: any | ((item: any) => TValue)
    ): Map<TKey, TValue[]> {
      const convertValue = guardFn<(item: any) => TValue>(valueSelector)
        ? valueSelector
        : (item: any) => item[valueSelector];
      const convertKey = guardFn<(item: any) => TKey>(keySelector)
        ? keySelector
        : (item: any) => item[keySelector];

      const groupedMap = this.reduce((entryMap, e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const k = convertKey(e);
        const newValue = convertValue(e);
        return entryMap.set(k, newValue);
      }, new Map());
      return groupedMap;
    };
  }

  if (!Array.prototype.flatGroup) {
    Array.prototype.flatGroup = function <TKey, TValue = unknown>(
      keySelector: unknown | ((item: any) => TKey),
      valueSelector?: any | ((item: any) => TValue)
    ): IKeyValue<TKey, TValue[]>[] {
      const map = this.toMap<TKey, TValue>(
        keySelector as string | number | symbol | ((item: any) => TKey),
        valueSelector
      );
      const res = Array.from(map, ([key, value]) => ({ key, value }));
      return res;
    };
  }
};
