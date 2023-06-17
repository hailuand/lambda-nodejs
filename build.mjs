import * as esbuild from "esbuild";
import glob from "tiny-glob";

const files = await glob("./src/lambda/*.ts");
files.forEach(async f => {
    const fileArr = f.split("/");
    const fileNameNoExtension = fileArr[fileArr.length - 1].split(".ts")[0];

    console.log(`Sanitized file Name: ${fileNameNoExtension}`);
    await esbuild.build({
        entryPoints: [f],
        outdir: `dist/lambda/${fileNameNoExtension}`,
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