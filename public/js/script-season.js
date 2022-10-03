import { read, writeFileXLSX } from "../../node_modules/xlsx/xlsx.mjs";

/* load the codepage support library for extended support with older formats  */
import { set_cptable } from "./xlsx.mjs";
import * as cptable from "./dist/cpexcel.full.mjs";
set_cptable(cptable);

// read();

const fileUploader = document.querySelector("#fileupload");
console.log(fileUploader);
fileUploader.addEventListener("change", () => {
  console.log(fileUploader.files);
  read(fileUploader.files[0]);
  const workBook = xlsx.readFile(fileUploader.files[0]);
  const workSheet = workBook.Sheets["Master"];
  const data = xlsx.utils.sheet_to_json(workSheet);
  console.log(data);
});
console.log("loaded");
