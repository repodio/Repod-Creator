const showdown = require("showdown");
const htmlConverter = new showdown.Converter();

const convertToMD = (html: string = ""): string => {
  return htmlConverter.makeMarkdown(html).replace("<!-- -->", "");
};

const convertToHTML = (md: string = ""): string => {
  return htmlConverter.makeHtml(md);
};

export { convertToMD, convertToHTML };
