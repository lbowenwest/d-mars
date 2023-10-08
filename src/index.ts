#! /usr/bin/env node

import {readFileSync} from "fs";
import {Command} from "commander";
import {chunk} from "lodash";
import {processInstruction} from "./mars";
import {Direction, Instruction, InstructionSet, Point, Result, World} from "./types";

export function parseStart(startString: string): Point {
    if (!/^[0-9]+ [0-9]+ [NESW]/.test(startString)) {
        throw new Error("invalid start position")
    }
    const startSplit = startString.split(" ")
    return {
        position: [parseInt(startSplit[0]), parseInt(startSplit[1])],
        direction: startSplit[2] as Direction
    }
}

export function parseInstructions(instructionString: string): Instruction[] {
    if (!/^[FRL]+/.test(instructionString)) {
        throw new Error("invalid instructions")
    }
    return instructionString.split("") as Instruction[]
}

export function parseFile(filename: string): { world: World, instructions: InstructionSet[] } {
    const contents = readFileSync(filename, "utf-8").split("\n");
    const worldSize = contents.at(0)?.split(" ").map(size => parseInt(size));
    if (worldSize?.length != 2) {
        console.error("worldSize", worldSize)
        throw new Error("invalid world size");
    }
    const instructions = chunk(contents.slice(1).filter(c => c.length > 0), 2).map((i): InstructionSet => {
        if (i.length != 2) {
            console.error("instructions", i)
            throw new Error("invalid instruction set");
        }
        return {
            start: parseStart(i[0]),
            instructions: parseInstructions(i[1])
        }
    })
    return {world: {size: [worldSize[0], worldSize[1]], lostPositions: new Set()}, instructions: instructions}
}

export function execute(filename: string) {
    let {world, instructions} = parseFile(filename);
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
