#! /usr/bin/env node

import {readFileSync} from "fs";
import {Command} from "commander";
import {chunk} from "lodash";
import {inBounds, processInstruction} from "./mars";
import {Direction, Instruction, InstructionSet, Point, Result, World} from "./types";

export function parseWorld(worldString: string): [number, number] {
    if (!/^[0-9]+ [0-9]+$/.test(worldString)) {
        throw new Error("invalid world size")
    }
    const coords = worldString.split(" ")
    const world: [number, number] = [parseInt(coords[0]), parseInt(coords[1])]
    if (!inBounds(world, [50, 50])) {
        throw new Error("world size exceeds limit")
    }
    return world
}

export function parseStart(startString: string): Point {
    if (!/^[0-9]+ [0-9]+ [NESW]/.test(startString)) {
        throw new Error("invalid start position")
    }
    const startSplit = startString.split(" ")
    const position: [number, number] = [parseInt(startSplit[0]), parseInt(startSplit[1])]
    if (!inBounds(position, [50, 50])) {
        throw new Error("position exceeds limit")
    }
    return {
        position,
        direction: startSplit[2] as Direction
    }
}

export function parseInstructions(instructionString: string): Instruction[] {
    if (!/^[FRL]+/.test(instructionString)) {
        throw new Error("invalid instructions")
    }
    return instructionString.split("") as Instruction[]
}

export function parseFile(contents: string[]): { world: World, instructions: InstructionSet[] } {
    const worldSize = parseWorld(contents.at(0) || "")
    if (worldSize?.length != 2) {
        console.error("worldSize", worldSize)
        throw new Error("invalid world size");
    }
    const instructions = chunk(contents.slice(1).filter(c => c.length > 0), 2).map((i): InstructionSet => {
        if (i.length != 2) {
            console.error("instructions", i)
            throw new Error("invalid instruction set");
        }
        const start = parseStart(i[0])
        if (!inBounds(start.position, worldSize)) {
            // spec doesn't really say if this can happen or not, might want to allow this and report as lost
            // before executing first instruction
            throw new Error("start position exceeds world size")
        }
        return {
            start,
            instructions: parseInstructions(i[1])
        }
    })
    return {world: {size: [worldSize[0], worldSize[1]], lostPositions: new Set()}, instructions: instructions}
}

export function execute(filename: string) {
    const contents = readFileSync(filename, "utf-8").split("\n");
    let {world, instructions} = parseFile(contents);
    const results = instructions.map((instruction): Result => processInstruction(world, instruction));
    results.forEach(({point, lost}) => {
        console.log(point.position[0], point.position[1], point.direction, lost ? "LOST" : "")
    })
}

if (require.main === module) {
    const program = new Command("mars");
    program
        .version("1.0.0")
        .description("Process robot instructions")
        .argument("<input-file>")
        .parse(process.argv)

    const input = program.processedArgs.pop();
    execute(input);
}
