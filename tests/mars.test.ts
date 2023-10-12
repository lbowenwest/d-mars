import { advance, inBounds, rotate, processInstruction } from "../src/mars";
import { InstructionSet, World } from "../src/types";

describe("utility", () => {
    test("rotating left", () => {
        expect(rotate("N", "L")).toBe("W");
        expect(rotate("E", "L")).toBe("N");
        expect(rotate("S", "L")).toBe("E");
        expect(rotate("W", "L")).toBe("S");
    });
    test("rotating right", () => {
        expect(rotate("N", "R")).toBe("E");
        expect(rotate("E", "R")).toBe("S");
        expect(rotate("S", "R")).toBe("W");
        expect(rotate("W", "R")).toBe("N");
    });
    test("rotating forwards", () => {
        expect(rotate("N", "F")).toBe("N");
        expect(rotate("E", "F")).toBe("E");
        expect(rotate("S", "F")).toBe("S");
        expect(rotate("W", "F")).toBe("W");
    });
    test("advancing north", () => {
        expect(advance({ position: [0, 0], direction: "N" })).toStrictEqual([
            0, 1,
        ]);
    });
    test("advancing east", () => {
        expect(advance({ position: [0, 0], direction: "E" })).toStrictEqual([
            1, 0,
        ]);
    });
    test("advancing south", () => {
        expect(advance({ position: [0, 0], direction: "S" })).toStrictEqual([
            0, -1,
        ]);
    });
    test("advancing west", () => {
        expect(advance({ position: [0, 0], direction: "W" })).toStrictEqual([
            -1, 0,
        ]);
    });
    test("in bounds", () => {
        const worldSize: [number, number] = [5, 3];
        expect(inBounds([-1, 0], worldSize)).toBeFalsy();
        expect(inBounds([0, -1], worldSize)).toBeFalsy();
        expect(inBounds([-1, -1], worldSize)).toBeFalsy();
        expect(inBounds([0, 0], worldSize)).toBeTruthy();
        expect(inBounds([1, 1], worldSize)).toBeTruthy();
        expect(inBounds([5, 3], worldSize)).toBeTruthy();
        expect(inBounds([6, 3], worldSize)).toBeFalsy();
        expect(inBounds([5, 4], worldSize)).toBeFalsy();
    });
});

describe("instruction processing", () => {
    test("going out of bounds", () => {
        let world: World = { size: [3, 3], lostPositions: new Set() };
        let instructions: InstructionSet = {
            start: { position: [0, 0], direction: "N" },
            instructions: ["F", "F", "F", "F"],
        };
        const result = processInstruction(world, instructions);
        expect(result).toStrictEqual({
            point: { position: [0, 3], direction: "N" },
            lost: true,
        });
        expect(world.lostPositions).toContainEqual("0-3");
    });
    test("out of bounds stops processing", () => {
        let world: World = { size: [3, 3], lostPositions: new Set() };
        let instructions: InstructionSet = {
            start: { position: [0, 0], direction: "N" },
            instructions: ["F", "F", "F", "F", "R"],
        };
        const result = processInstruction(world, instructions);
        expect(result).toStrictEqual({
            point: { position: [0, 3], direction: "N" },
            lost: true,
        });
    });
    test("stops next going out of bounds", () => {
        let world: World = { size: [3, 3], lostPositions: new Set() };
        let first_instructions: InstructionSet = {
            start: { position: [0, 0], direction: "N" },
            instructions: ["F", "F", "F", "F"],
        };
        let second_instructions: InstructionSet = {
            start: { position: [0, 0], direction: "N" },
            instructions: ["F", "F", "F", "F"],
        };
        const result = processInstruction(world, first_instructions);
        const second = processInstruction(world, second_instructions);
        expect(result).toStrictEqual({
            point: { position: [0, 3], direction: "N" },
            lost: true,
        });
        expect(second).toStrictEqual({
            point: { position: [0, 3], direction: "N" },
            lost: false,
        });
        expect(world.lostPositions).toContainEqual("0-3");
    });
    test("first example", () => {
        let world: World = { size: [5, 3], lostPositions: new Set() };
        let instructions: InstructionSet = {
            start: { position: [1, 1], direction: "E" },
            instructions: ["R", "F", "R", "F", "R", "F", "R", "F"],
        };
        const result = processInstruction(world, instructions);
        expect(result).toStrictEqual({
            point: { position: [1, 1], direction: "E" },
            lost: false,
        });
        expect(world.lostPositions).toStrictEqual(new Set());
    });
    test("second example", () => {
        let world: World = { size: [5, 3], lostPositions: new Set() };
        let instructions: InstructionSet = {
            start: { position: [3, 2], direction: "N" },
            instructions: [
                "F",
                "R",
                "R",
                "F",
                "L",
                "L",
                "F",
                "F",
                "R",
                "R",
                "F",
                "L",
                "L",
            ],
        };
        const result = processInstruction(world, instructions);
        expect(result).toStrictEqual({
            point: { position: [3, 3], direction: "N" },
            lost: true,
        });
        expect(world.lostPositions).toContainEqual("3-3");
    });
    test("third example (after second)", () => {
        let world: World = {
            lostPositions: new Set<string>(["3-3"]),
            size: [5, 3],
        };
        let instructions: InstructionSet = {
            start: { position: [0, 3], direction: "W" },
            instructions: ["L", "L", "F", "F", "F", "L", "F", "L", "F", "L"],
        };
        const result = processInstruction(world, instructions);
        expect(result).toStrictEqual({
            point: { position: [2, 3], direction: "S" },
            lost: false,
        });
    });
});
