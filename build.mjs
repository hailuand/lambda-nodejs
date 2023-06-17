import * as esbuild from "esbuild";
import glob from "tiny-glob";
import archiver from "archiver";
import fs from "fs";

const files = await glob("./src/lambda/*.ts");

files.forEach(async f => {
    const fileArr = f.split("/");
    const fileNameNoExtension = fileArr[fileArr.length - 1].split(".ts")[0];
    const out = `./dist/lambda/${fileNameNoExtension}`;

    await esbuild.build({
        entryPoints: [f],
        outdir: out,
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

    fs.mkdir("./assets", () => {
        const archive = archiver("zip", {
            zlib: { level: 9}
        });
        archive.on('error', function(err) {
            throw err;
          });

        const zipOutput = fs.createWriteStream(`./assets/${fileNameNoExtension}.zip`);
        archive.pipe(zipOutput);    
        archive.directory(out + "/", false);
        archive.finalize();
    });
});

// await esbuild.build({
//     entryPoints: await glob("./src/lambda/*.ts"),
//     outdir: "dist",
//     bundle: true,
//     minify: true,
//     sourcemap: "external",
//     treeShaking: true,
//     platform: "node",
//     target: "node18",
//     external: [
//         "aws-sdk",
//         "@aws-sdk/*"
//     ]
// });