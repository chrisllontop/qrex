declare module "dijkstrajs" {
  export function find_path(graph: Record<string, Record<string, number>>, start: string, end: string): string[];
}
