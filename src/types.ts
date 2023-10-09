export type Direction = "N" | "E" | "S" | "W";
export type Instruction = "L" | "R" | "F";
export type World = {
  size: [number, number];
  lostPositions: Set<string>;
};
export type Point = {
  position: [number, number];
  direction: Direction;
};
export type InstructionSet = {
  start: Point;
  instructions: Instruction[];
};
export type Result = {
  point: Point;
  lost: boolean;
};
