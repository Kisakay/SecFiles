import { sexsec } from "../sexsec";
import log from "./log";

export default async function decryptDir(path: string): Promise<void> {
    log(`Decrypting ${path.blue} ...\r\n`.gray)
    sexsec.decryptDir(path, false)
}