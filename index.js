const fs = require("fs");
const path = require("path");
const max = 9999;
let index = 0;

function getDirectoryMap(dir) {
  /** @type {{path:String,name:String,depth:String,type:"directory"|"file"}[]} */
  const result = [];

  const getDirectory = (dir, depth = 1) => {
    index += 1;
    if (max < index) {
      throw new Error();
    }
    // 获取路径下使用文件夹和文件名称
    const filesList = fs.readdirSync(dir);
    for (let index = 0; index < filesList.length; index++) {
      const file = filesList[index];
      const subPath = path.join(dir, file); // 拼接相对路径
      const stats = fs.statSync(subPath); // 拿到文件信息对象
      const isDirectory = stats.isDirectory(); // 判断是否为文件夹

      if (
        isDirectory &&
        ["img", "images"].some((item) => file.includes(item))
      ) {
        break;
      }

      const resultItem = {
        path: subPath,
        name: file,
        depth,
        type: isDirectory ? "directory" : "file",
      };
      result.push(resultItem);

      if (isDirectory) {
        getDirectory(subPath, depth + 1);
      }
    }
  };
  getDirectory(dir);
  return result;
}

//-------------------------------------------------
const dir = path.join("./笔记");
const result = getDirectoryMap(dir);
const content = [];

for (let index = 0; index < result.length; index++) {
  const item = result[index];
  const depth = parseInt(item.depth);
  let h = "".padStart(depth + 1, "#");
  let title = "";
  if (item.type === "directory") {
    title = item.name;
  }
  if (item.type === "file") {
    const path = item.path.replace(/\s/g, "%20C");
    title = `[${item.name}](${path})`;
    h = `- ${h}`;
  }
  const line = `${h} ${title}`;
  content.push(line);
}

const strContent = content.join("\n");
fs.writeFile("./README.md", strContent, () => {});

// fs.writeFile("./direct.js", JSON.stringify(result, null, 2), "utf-8", () => {});
// console.log(JSON.stringify(direct, null, 2));
