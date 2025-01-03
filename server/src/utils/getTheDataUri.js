import DataUriParser from "datauri/parser.js";
import path from "path";

let parser = new DataUriParser();

export let getthedatauri = (file) => {
  try {
    let extName = path.extname(file.originalname).toString();
    let datauri = parser.format(extName, file.buffer).content;

    if (typeof datauri === "string") {
        
      return datauri;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
