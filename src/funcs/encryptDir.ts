import { sexsec } from "../sexsec";
import log from "./log";

export default async function encryptDir(path: string): Promise<void> {
    log(`Encrypting ${path.blue} ...\r\n`.gray)
    sexsec.encryptDir(path, false)
}