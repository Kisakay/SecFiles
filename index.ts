import { stat } from "fs/promises";
import "./src/funcs/colors";

import encryptFile from "./src/funcs/encryptFile";
import encryptDir from "./src/funcs/encryptDir";
import { sexsec } from "./src/sexsec";
import ext from "./src/funcs/exit";
import log from "./src/funcs/log";
import ask from "./src/funcs/ask";
import decryptFile from "./src/funcs/decryptFiles";
import decryptDir from "./src/funcs/decryptDir";

log(`
   ▄████████    ▄████████ ▀████    ▐████▀    ▄████████  ▄█   ▄█          ▄████████    ▄████████ 
  ███    ███   ███    ███   ███▌   ████▀    ███    ███ ███  ███         ███    ███   ███    ███ 
  ███    █▀    ███    █▀     ███  ▐███      ███    █▀  ███▌ ███         ███    █▀    ███    █▀  
  ███         ▄███▄▄▄        ▀███▄███▀     ▄███▄▄▄     ███▌ ███        ▄███▄▄▄       ███        
▀███████████ ▀▀███▀▀▀        ████▀██▄     ▀▀███▀▀▀     ███▌ ███       ▀▀███▀▀▀     ▀███████████ 
         ███   ███    █▄    ▐███  ▀███      ███        ███  ███         ███    █▄           ███ 
   ▄█    ███   ███    ███  ▄███     ███▄    ███        ███  ███▌    ▄   ███    ███    ▄█    ███ 
 ▄████████▀    ██████████ ████       ███▄   ███        █▀   █████▄▄██   ██████████  ▄████████▀  
                                                            ▀                                   \r\n`.green);

log("> An easy way to encrypt/decrypt files in this terminal\r\n\n".italic.yellow);

let key = await ask("What's your encryption/decryption key ?".gray + " >> ".white);
sexsec.changeKey(key);

async function loop() {

  let action = await ask("Wanna encode or decode ?".gray + " (e/d)".blue + " >> ".white);

  if (action.toLowerCase() === "e") {
    let path = await ask("What's the path of the files/directory to ".gray + "encrypt".boldText.gray + " ?".gray + " >> ".white);
    let type: 'dir' | 'file' | 'unknown';
    if (!path) ext();

    try {
      let get = await stat(path);

      if (get.isFile()) type = "file";
      else if (get.isDirectory()) type = "dir";
      else type = "unknown";
    } catch {
      throw new Error("The actual path is not a files or a directory")
    }

    if (type === "file") {
      await encryptFile(path);
    } else if (type === "dir") {
      await encryptDir(path);
    }
  } else if (action.toLowerCase() === "d") {
    let path = await ask("What's the path of the files/directory to ".gray + "decrypt".boldText.gray + " ?".gray + " >> ".white);
    let type: 'dir' | 'file' | 'unknown';
    if (!path) ext();

    try {
      let get = await stat(path);

      if (get.isFile()) type = "file";
      else if (get.isDirectory()) type = "dir";
      else type = "unknown";
    } catch {
      throw new Error("The actual path is not a files or a directory")
    }

    if (type === "file") {
      await decryptFile(path);
    } else if (type === "dir") {
      await decryptDir(path);
    }
  }

  log(`--- \r\n\n`.gray)
  await loop()
};

loop()