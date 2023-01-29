const fs = require("fs");
const path = require("path");

function getDirectoryMap(dir) {
  /** @type {{path:String,name:String,depth:String,type:"directory"|"file"}[]} */
  const result = [];

  const getDirectory = (dir, depth = 1) => {
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
        continue;
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
function getMdLine(dir, title) {
  dir = path.join(dir);
  const result = getDirectoryMap(dir);
  const content = [`# ${title}`];

  for (let index = 0; index < result.length; index++) {
    const item = result[index];
    const depth = parseInt(item.depth);
    let h = "".padStart(depth + 1, "#");
    let title = "";
    if (item.type === "directory") {
      title = item.name;
    }
    if (item.type === "file") {
      const path = item.path.replace(/\s/g, "%20").replace(/\\/g, "/");
      title = `[${item.name}](${path})`;
      h = `-`;
    }
    const line = `${h} ${title}`;
    content.push(line);
  }

  return content;
}
const content1 = getMdLine("./工作日志", "工作日志");
const content2 = getMdLine("./笔记", "笔记");

const content = [...content1, ...content2];
const strContent = content.join("\n");
fs.writeFile("./README.md", strContent, () => {});

// fs.writeFile("./direct.js", JSON.stringify(result, null, 2), "utf-8", () => {});
// console.log(JSON.stringify(direct, null, 2));
