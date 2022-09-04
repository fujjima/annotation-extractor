const fs = require("fs")
const program = require("commander")

program.parse(process.argv)
const filePath = program.args[0]

fs.readFile(filePath, { encoding: "utf8" }, (err, file) => {
  if (err) {
    console.error(err);
  } else {
    // タグの内容の抽出等を行う
    console.log(file);
  }
});
