import { rl } from "../readline";

export default async function ask(str: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(str, (answer) => {
      resolve(answer);
    });
  });
}