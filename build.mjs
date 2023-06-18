import * as esbuild from "esbuild";
import glob from "tiny-glob";
import archiver from "archiver";
import fs from "fs";

const files = await glob("./src/lambda/*.ts");
const archiveDistRoot = `./dist/lambda/archive`;
fs.mkdirSync(archiveDistRoot, {
    recursive: true
});

files.forEach(async f => {
    const fileArr = f.split("/");
    const fileNameNoExtension = fileArr[fileArr.length - 1].split(".ts")[0];
    const srcOut = `./dist/lambda/src/${fileNameNoExtension}`;

    await esbuild.build({
        entryPoints: [f],
        outdir: srcOut,
        bundle: true,
        minify: true,
        sourcemap: "external",
        treeShaking: true,
        platform: "node",
        target: "node18",
        external: [
            "aws-sdk",
            "@aws-sdk/*"
        ]
    });

    const archive = archiver("zip", {
        zlib: { level: 9}
    });
    archive.on('error', function(err) {
        throw err;
      });

    const archiveOut = `./dist/lambda/archive/${fileNameNoExtension}`;
    const zipOutput = fs.createWriteStream(`${archiveOut}.zip`);
    archive.pipe(zipOutput);    
    archive.directory(srcOut + "/", false);
    archive.finalize();
});