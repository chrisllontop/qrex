declare module "dijkstrajs" {
  export function find_path(graph: { [key: string]: { [key: string]: number } }, start: string, end: string): string[];
}
