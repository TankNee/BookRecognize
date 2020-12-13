import Core from "@alicloud/pop-core";
import OSS from "ali-oss";
import path from "path";
import formidable from "formidable";
import imageSize from "image-size";
import fs from "fs";
import { Request } from "express";
import { ISizeCalculationResult } from "image-size/dist/types/interface";

const client = new Core({
    accessKeyId: process.env["ACCESS_KEY"] || "",
    accessKeySecret: process.env["ACCESS_KEY_SECRET"] || "",
    endpoint: "https://ocr.cn-shanghai.aliyuncs.com",
    apiVersion: "2019-12-30",
});

const OSSClient = new OSS({
    region: "cn-shanghai",
    accessKeyId: process.env["ACCESS_KEY"] || "",
    accessKeySecret: process.env["ACCESS_KEY_SECRET"] || "",
    bucket: process.env["BUCKET_NAME"] || "",
    endpoint: "http://oss-cn-shanghai.aliyuncs.com",
});

var params = {
    RegionId: "cn-shanghai",
};

var requestOption = {
    method: "POST",
};

interface UploadFile {
    fileName: string;
    absolutePath: string;
    relativePath: string;
    dimensions: ISizeCalculationResult;
}

function recognizeCharacter(payload: any) {
    params = { ...params, ...payload };
    return client.request("RecognizeCharacter", params, requestOption);
}
/**
 *
 * @param req 请求
 * @param options 请求解析选项
 */
async function parseUpload(req: Request, options: any = {}) {
    var form = new formidable.IncomingForm();
    form.encoding = options.encoding || "utf-8";
    form.uploadDir = options.uploadDir || path.join(__dirname + "/../../resources/upload/image");
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = options.maxFieldsSize || 5 * 1024 * 1024; // 最大5MB
    const result = new Promise<UploadFile[]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            var fileArray: formidable.File[] = new Array();
            var fileNameArray = new Array();
            for (var key in files) {
                if (files[key].size === 0) {
                    fs.unlinkSync(files[key].path);
                    reject(files);
                    return;
                } else {
                    fileArray.push(files[key]);
                }
            }
            fileArray.forEach((file) => {
                var fileName = file.name;
                var nameArray = fileName.split(".");
                var suffix = nameArray[nameArray.length - 1];
                var newFileName = `${Date.now()}${Math.floor(Math.random() * 10000000)}.${suffix}`;
                var newPath = `${form.uploadDir}/${newFileName}`;
                fs.renameSync(file.path, newPath);
                var dimensions = imageSize(newPath);
                fileNameArray.push({
                    fileName: newFileName,
                    absolutePath: newPath,
                    relativePath: `/resources/upload/image/${newFileName}`,
                    dimensions: dimensions,
                });
            });
            resolve(fileNameArray);
        });
    });
    return await result;
}
/**
 *
 * @param fileName 文件名
 * @param fileAbsolutePath 文件绝对路径
 * @param options 上传选项
 */
function uploadToOSS(fileName: string, fileAbsolutePath: string, options: any = {}) {
    return OSSClient.put(fileName, fileAbsolutePath, options);
}

export { uploadToOSS, parseUpload, recognizeCharacter };
