import {Direction, Instruction, InstructionSet, Point, Result, World} from "./types";

export function rotate(start: Direction, instruction: Instruction): Direction {
    if (instruction == "F") {
        return start
    }
    switch (start) {
        case "N":
            return instruction == "L" ? "W" : "E"
        case "E":
            return instruction == "L" ? "N" : "S"
        case "S":
            return instruction == "L" ? "E" : "W"
        case "W":
            return instruction == "L" ? "S" : "N"
    }
}

export function advance(start: Point): [number, number] {
    switch (start.direction) {
        case "N":
            return [start.position[0], start.position[1] + 1]
        case "E":
            return [start.position[0] + 1, start.position[1]]
        case "S":
            return [start.position[0], start.position[1] - 1]
        case "W":
            return [start.position[0] - 1, start.position[1]]
    }
}

export function inBounds(position: [number, number], worldSize: [number, number]): boolean {
    return !(position[0] < 0 || position[0] > worldSize[0] || position[1] < 0 || position[1] > worldSize[1])
}

export function processInstruction(world: World, instructionSet: InstructionSet): Result {
    let point = instructionSet.start;
    for (let instruction of instructionSet.instructions) {
        point.direction = rotate(point.direction, instruction)
        if (instruction == "F") {
            const position = advance(point);
            if (inBounds(position, world.size)) {
                point.position = position
                continue
            }
            if (world.lostPositions.has(point.position.join("-"))) {
                continue
            }
            world.lostPositions.add(point.position.join("-"))
            return {point, lost: true}
        }
    }
    return { point, lost: false }
}