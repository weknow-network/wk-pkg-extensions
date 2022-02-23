import { extendStringPrototype } from "./String-extensions";

extendStringPrototype();

test("toCamel", () => {
  const unionedArray = "HelloWorld".toCamel();
  const expectedResult = "helloWorld";

  expect(unionedArray).toBe(expectedResult);
});

test("toCamel-unchanged", () => {
  const unionedArray = "helloWorld".toCamel();
  const expectedResult = "helloWorld";

  expect(unionedArray).toBe(expectedResult);
});

test("toCamel-withSpace", () => {
  const unionedArray = "HelloGreat world".toCamel();
  const expectedResult = "helloGreatWorld";

  expect(unionedArray).toBe(expectedResult);
});

test("toCamel-withDash", () => {
  const unionedArray = "Hello-world".toCamel();
  const expectedResult = "helloWorld";

  expect(unionedArray).toBe(expectedResult);
});

test("toDash", () => {
  const unionedArray = "HelloWorld".toDash();
  const expectedResult = "hello-world";

  expect(unionedArray).toBe(expectedResult);
});

test("toDash-unchanged", () => {
  const unionedArray = "helloWorld".toDash();
  const expectedResult = "hello-world";

  expect(unionedArray).toBe(expectedResult);
});

test("toDash-withSpace", () => {
  const unionedArray = "HelloGreat world".toDash();
  const expectedResult = "hello-great-world";

  expect(unionedArray).toBe(expectedResult);
});

test("toDash-withDash", () => {
  const unionedArray = "Hello-world".toDash();
  const expectedResult = "hello-world";

  expect(unionedArray).toBe(expectedResult);
});
