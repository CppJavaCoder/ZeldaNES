export const enum Command {
    NULL,
    SPAWN_ACTOR
}
  
  export interface ICommandBuffer {
    runCommand(command: Command, param: number, callback?: Function): void;
    runWarp(entrance: number, cutscene: number, callback?: Function): void;
  }
  