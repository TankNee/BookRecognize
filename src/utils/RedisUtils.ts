import redis from "redis";
import formidable from "formidable";

const client = redis.createClient();
/**
 * Check Existence
 * @param file
 */
function getExistenceFileInfo(file: formidable.File) {
    const hash = file.hash || "";
    return client.get(hash, redis.print);
}

function setFileInfo(file: formidable.File, fileInfo: any) {
    const hash = file.hash || "";
    return client.set(hash, fileInfo, redis.print);
}
