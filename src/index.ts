import fse from "fs-extra";
import * as path from "path";

const rootDest: string | undefined = process.argv[2];
const outputDest: string = path.join(rootDest, "OUTPUT_FILE.txt");

run()
  .then(() => console.log("Running plugin-extractor."))
  .catch((err) => console.log(err));

async function run(): Promise<void> {
  // If folder doesn't exist, exit
  if (!rootDest || !fse.lstatSync(rootDest).isDirectory()) {
    console.log("Path entered is not a valid directory.");
    return;
  }

  await fse.writeFile(outputDest, "");
  traverseDir(rootDest);
}

async function traverseDir(filePath: string): Promise<void> {
  const fileArgs: string[] = await fse.readdir(filePath);

  for (const fileArg of fileArgs) {
    const newPath: string = path.join(filePath, fileArg);
    if (fse.lstatSync(newPath).isDirectory()) {
      // If path is a directory
      await traverseDir(newPath);
    } else {
      // If path is a file
      if (!newPath.includes('.dll')) {
        continue;
      }

      const outputContent: string = (await fse.readFile(outputDest, 'utf-8')).toString();
      const newContent: string = `File: ${fileArg}                  Path: ${newPath} \n`;

      await fse.writeFile(outputDest, outputContent + newContent);
    }
  }
}
