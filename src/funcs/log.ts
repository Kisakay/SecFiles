export default async function log(str: string | Uint8Array<ArrayBufferLike>): Promise<void> {
    process.stdout.write(str)
}