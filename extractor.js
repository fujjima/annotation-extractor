const fs = require("fs")
const program = require("commander")
const _ = require("lodash")

// to use jquery $
// ref) https://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document
let jsdom = require('jsdom');
const windowObject = new jsdom.JSDOM().window;
const DOMParser = windowObject.DOMParser
const parser = new DOMParser()
const $ = require('jquery')(windowObject);

program.parse(process.argv)
const filePath = program.args[0]

let output = ``

fs.readFile(filePath, { encoding: "utf8" }, (err, file) => {
  if (err) {
    console.error(err);
  } else {
    let document = parser.parseFromString(file, "text/html")
    let h2Item = document.querySelector('h2')
    let devidedArray = []

    let siblings = Array.from(h2Item.parentNode.children).filter(element => {
      if (element.localName === 'h2' || element.localName === 'div') return element;
    });

    // 配列内の要素を [[h2, div, div, div], [h2, div], ...] のようにh2を基準に分割する
    siblings.reduce((acc, item, idx) => {
      if (item.localName == 'h2' && idx != 0) {
        devidedArray.push(acc)
        acc = []
      }
      acc.push(item)
      return acc
    }, [])

    // console.log(devidedArray[0][0].textContent)
  }
});


// fs.writeFileSync('output.md', output, (err) => {
//   if (err) { throw err; }
//   console.log('made output');
// });

