import * as XLSX from "../../node_modules/xlsx/xlsx.mjs";

/* load 'fs' for readFile and writeFile support */
import * as fs from "../../node_modules/fs/";
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from "../../node_modules/stream/";
XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from "../../node_modules/xlsx/dist/cpexcel.full.mjs";
XLSX.set_cptable(cpexcel);

const fileUploader = document.querySelector("#fileupload");
console.log(fileUploader);
fileUploader.addEventListener("change", () => {
  console.log(fileUploader.files);
  const workBook = XLSX.readFile(fileUploader.files[0]);
  const workSheet = workBook.Sheets["Master"];
  const data = XLSX.utils.sheet_to_json(workSheet);
  console.log(data);
});
console.log("loaded");
