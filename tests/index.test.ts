import {
  execute,
  parseInstructions,
  parseStart,
  parseWorld,
  parseFile,
} from "../src";

describe("execute", () => {
  test("sample", () => {
    const logSpy = jest.spyOn(console, "log");
    execute("tests/sample.txt");
    expect(logSpy.mock.calls).toEqual([
      [1, 1, "E", ""],
      [3, 3, "N", "LOST"],
      [2, 3, "S", ""],
    ]);
  });
});

describe("parsing", () => {
  test("start", () => {
    expect(parseStart("1 1 E")).toStrictEqual({
      position: [1, 1],
      direction: "E",
    });
    expect(parseStart("5 7 S")).toStrictEqual({
      position: [5, 7],
      direction: "S",
    });
    expect(parseStart("50 50 S")).toStrictEqual({
      position: [50, 50],
      direction: "S",
    });
  });
  test.each(["1 1 E", "14 39 N", "12 12 E"])("start parsing: %s", (input) => {
    expect(() => parseStart(input)).not.toThrowError();
  });
  test.each(["-1 0 N", "0 -1 N", "1 1 asd", "asdnbasf", "51 51 N"])(
    "start passing error: %s",
    (input) => {
      expect(() => parseStart(input)).toThrowError();
    },
  );
  test.each(["LFRLFR", "L", "LFR", "FFFF"])(
    "instructions parsing: %s",
    (input) => {
      expect(() => parseInstructions(input)).not.toThrowError();
    },
  );
  test.each(["", "asd"])("instructions parsing error: %s", (input) => {
    expect(() => parseInstructions(input)).toThrowError("invalid instructions");
  });
  test.each(["0 0", "12 12", "1 3", "50 50"])("world parsing: %s", (input) => {
    expect(() => parseWorld(input)).not.toThrowError();
  });
  test.each(["", "asd", "-1 1", "1 wpd", "51 51"])(
    "world parsing error: %s",
    (input) => {
      expect(() => parseWorld(input)).toThrowError();
    },
  );
});
