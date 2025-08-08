import { sexsec } from "../sexsec";
import log from "./log";

export default async function decryptFile(path: string): Promise<void> {
    log(`Decrypting ${path.blue} ...\r\n`.gray)
    sexsec.decryptFile(path, false)
}