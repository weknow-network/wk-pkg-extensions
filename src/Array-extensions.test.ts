import { extendArrayPrototype } from "./Array-extensions";

extendArrayPrototype();

test("toRecord", () => {
  const unionedArray = [
    { k: "target", v: "a" },
    { k: "amount", v: 2 },
  ].toRecord("k", (m) => m.v);
  const expectedResult = { target: "a", amount: 2 };

  expect(unionedArray).toMatchObject(expectedResult);
});

test("toRecord-with-override", () => {
  const unionedArray = [
    { k: "target", v: "a" },
    { k: "amount", v: 2 },
    { k: "target", v: "b" },
  ].toRecord("k", (m) => m.v);
  const expectedResult = { target: "b", amount: 2 };

  expect(unionedArray).toMatchObject(expectedResult);
});

test("toRecordMap", () => {
  const unionedArray = [
    { k: "target", v: 1 },
    { k: "amount", v: 2 },
  ].toRecordMap(
    (m) => m.k,
    (m) => m.v
  );
  const expectedResult = new Map<string, number>();
  expectedResult.set("target", 1);
  expectedResult.set("amount", 2);

  expect(unionedArray).toMatchObject(expectedResult);
});

test("toRecordMap-override", () => {
  const unionedArray = [
    { k: "target", v: 1 },
    { k: "amount", v: 2 },
    { k: "target", v: 3 },
  ].toRecordMap(
    (m) => m.k,
    (m) => m.v
  );
  const expectedResult = new Map<string, number>();
  expectedResult.set("target", 1);
  expectedResult.set("amount", 3);

  expect(unionedArray).toMatchObject(expectedResult);
});

test("toRecordSelf-number", () => {
  const unionedArray = [1, 2, 3].toRecordSelf((m, i) => m * i);
  const expectedResult = { 1: 0, 2: 2, 3: 6 };

  expect(unionedArray).toMatchObject(expectedResult);
});

test("toRecordSelf-string", () => {
  const unionedArray = ["a", "b", "c"].toRecordSelf((m, i) => `${m} -> ${i}`);
  const expectedResult = { a: "a -> 0", b: "b -> 1", c: "c -> 2" };

  expect(unionedArray).toMatchObject(expectedResult);
});

test("toMap", () => {
  const unionedArray = [
    { id: 1, val: "A" },
    { id: 2, val: "B" },
  ].toMap("id", "val");
  const expectedResult = new Map<number, string>();
  expectedResult.set(1, "A");
  expectedResult.set(2, "B");

  expect(unionedArray).toMatchObject(expectedResult);
});

test("toMap (override)", () => {
  const unionedArray = [
    { id: 1, val: "A1" },
    { id: 1, val: "A2" },
    { id: 2, val: "B" },
  ].toMap("id", "val");

  const r1 = unionedArray.get(1);
  const r2 = unionedArray.get(2);

  expect(r1).toMatch( 'A2');
  expect(r2).toMatch('B');
});

test("toMap_using function", () => {
  const unionedArray = [
    { id: 1, val: "A1" },
    { id: 1, val: "A2" },
    { id: 2, val: "B" },
  ].toMap(m => m.id, m => m.val);

  const r1 = unionedArray.get(1);
  const r2 = unionedArray.get(2);

  expect(r1).toMatch( 'A2');
  expect(r2).toMatch('B');
});

test("toMap_using (no value map)", () => {
  const arr =  [
    { id: 1, val: "A1" },
    { id: 1, val: "A2" },
    { id: 2, val: "B" },
  ];
  const unionedArray = arr.toMap('id');

  const r1 = unionedArray.get(1);
  const r2 = unionedArray.get(2);

  expect(r1).toMatchObject(arr[1]);
  expect(r2).toMatchObject(arr[2]);
});


test("toKeyValueArray", () => {
  const unionedArray = [
    { id: 1, val: "A" },
    { id: 2, val: "B" },
  ].toKeyValueArray("id", "val");


  expect(unionedArray[0]).toMatchObject({ key: 1, value: "A" });
  expect(unionedArray[1]).toMatchObject({ key: 2, value: "B" });
});

test("groupBy", () => {
  const unionedArray = [
    { id: 1, val: "A1" },
    { id: 1, val: "A2" },
    { id: 2, val: "B" },
  ].groupBy("id", "val");

  const r1 = unionedArray.get(1);
  const r2 = unionedArray.get(2);

  expect(r1).toMatchObject( ['A1','A2']);
  expect(r2).toMatchObject(['B']);
});

test("groupBy_using function", () => {
  const unionedArray = [
    { id: 1, val: "A1" },
    { id: 1, val: "A2" },
    { id: 2, val: "B" },
  ].groupBy(m => m.id, m => m.val);

  const r1 = unionedArray.get(1);
  const r2 = unionedArray.get(2);

  expect(r1).toMatchObject( ['A1','A2']);
  expect(r2).toMatchObject(['B']);
});


test("toKeyValueArray", () => {
  const unionedArray = [
    { id: 1, val: "A1" },
    { id: 1, val: "A2" },
    { id: 2, val: "B" },
  ].groupByToArray("id", "val");


  expect(unionedArray[0]).toMatchObject({ key: 1, value: ["A1", 'A2'] });
  expect(unionedArray[1]).toMatchObject({ key: 2, value: ["B"] });
});

//------------

test("union", () => {
  const unionedArray = [1, 2, 3].union([2, 3, 4, 5]);
  const expectedResult = [1, 2, 3, 4, 5];

  expect(unionedArray).toMatchObject(expectedResult);
});

test("intersect", () => {
  const unionedArray = [1, 2, 3].intersect([2, 3, 4, 5]);
  const expectedResult = [2, 3];

  expect(unionedArray).toMatchObject(expectedResult);
});

test("except", () => {
  const unionedArray = [1, 2, 3, 4].except([3, 4, 5]);
  const expectedResult = [1, 2];

  expect(unionedArray).toMatchObject(expectedResult);
});

test("findMap", () => {
  const unionedArray = [1, 2, 3, 4].findMap((m) =>
    m > 2 ? `value is ${m}` : undefined
  );
  const expectedResult = "value is 3";

  expect(unionedArray).toBe(expectedResult);
});

test("findMap-missing", () => {
  const unionedArray = [1, 2, 3, 4].findMap((m) =>
    m == 0 ? `Succeed` : undefined
  );
  expect(unionedArray).toBeUndefined();
});

test("toSet", () => {
  const arr = [1, 2, 3, 4];
  const unionedArray = arr.toSet();
  const expectedResult = new Set(arr);

  expect(unionedArray).toMatchObject(expectedResult);
});

test("any-true", () => {
  const unionedArray = [1, 2, 3, 4].any((m) => m > 2);

  expect(unionedArray).toBeTruthy();
});

test("any-false", () => {
  const unionedArray = [1, 2, 3, 4].any((m) => m == 0);

  expect(unionedArray).toBeFalsy();
});

test("all-true", () => {
  const unionedArray = [1, 2, 3, 4].all((m) => m > 0);

  expect(unionedArray).toBeTruthy();
});

test("all-false", () => {
  const unionedArray = [1, 2, 3, 4].all((m) => m > 2);

  expect(unionedArray).toBeFalsy();
});
