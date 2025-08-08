import { sexsec } from "../sexsec";
import log from "./log";

export default async function encryptFile(path: string): Promise<void> {
    log(`Encrypting ${path.blue}... \r\n`.gray)
    const out_path = await sexsec.encryptFile(path, false);
    log(`Output files is now at: ${out_path.blue}\r\n`.gray);
}