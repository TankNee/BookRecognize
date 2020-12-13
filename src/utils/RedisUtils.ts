import redis from "redis";
import formidable from "formidable";

const client = redis.createClient();
/**
 * Check Existence
 * @param file
 */
async function getFileInfo(file: formidable.File) {
    const hash = file.hash || "";
    return await new Promise((resolve, reject) => {
        client.get(hash, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res) {
                resolve(JSON.parse(res));
            } else {
                resolve(null);
            }
        });
    });
}

function setFileInfo(file: formidable.File, fileInfo: any) {
    const hash = file.hash || "";
    return client.set(hash, JSON.stringify(fileInfo), redis.print);
}

async function getOSSFileInfo(fileName: string) {
    return await new Promise((resolve, reject) => {
        client.get(fileName, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res) {
                resolve(JSON.parse(res));
            } else {
                resolve(null);
            }
        });
    });
}

function setOSSFileInfo(fileName: string, OSSFileInfo: any) {
    return client.set(fileName, JSON.stringify(OSSFileInfo), redis.print);
}
async function getRecognizationInfo(cacheKey: string) {
    return await new Promise((resolve, reject) => {
        client.get(cacheKey, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res) {
                resolve(JSON.parse(res));
            } else {
                resolve(null);
            }
        });
    });
}

function setRecognizationInfo(cacheKey: string, recognizationInfo: any) {
    return client.set(cacheKey, JSON.stringify(recognizationInfo), redis.print);
}
export { getFileInfo, setFileInfo, getOSSFileInfo, setOSSFileInfo, getRecognizationInfo, setRecognizationInfo };
