import { readFile } from "fs/promises";

export async function readFileJson<T = any>(p: string) {
  const data = await readFile(p, "utf-8");
  return JSON.parse(data) as T;
}
