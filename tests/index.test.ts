import {execute, parseInstructions, parseStart} from "../src";

describe("execute", () => {
    test("sample", () => {
        const logSpy = jest.spyOn(console, "log")
        execute("tests/sample.txt")
        expect(logSpy.mock.calls).toEqual(
            [
                [1, 1, "E", ""],
                [3, 3, "N", "LOST"],
                [2, 3, "S", ""],
            ]
        )
    })
})

describe("parsing", () => {
    test("start", () => {
        expect(parseStart("1 1 E")).toStrictEqual({position: [1, 1], direction: "E"})
        expect(parseStart("5 7 S")).toStrictEqual({position: [5, 7], direction: "S"})
    })
    test.each(["1 1 E", "14 39 N", "12 12 E"])(
        "start parsing: %s",
        (input) => {
            expect(() => parseStart(input)).not.toThrowError()
        })
    test.each(["-1 0 N", "0 -1 N", "1 1 asd", "asdnbasf"])(
        "start passing error: %s",
        (input) => {
            expect(() => parseStart(input)).toThrowError("invalid start position")
        }
    )
    test.each(["LFRLFR", "L", "LFR", "FFFF"])(
        "instructions parsing: %s",
        (input) => {
            expect(() => parseInstructions(input)).not.toThrowError()
        }
    )
    test.each(["", "asd"])(
        "instructions parsing error: %s",
        (input) => {
            expect(() => parseInstructions(input)).toThrowError("invalid instructions")
        }
    )
})