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

let devidedArray = []

const file = fs.readFileSync(filePath, { encoding: "utf8" }, err => {
  if (err) {
    console.error(err);
  }
});

let document = parser.parseFromString(file, "text/html")
let h2Item = document.querySelector('h2')

let siblings = Array.from(h2Item.parentNode.children).filter(element => {
  if (element.localName === 'h2' || element.localName === 'div') return element;
});


const toTextStrings = (nodeLists) => {
  const text = nodeLists.reduce((prev, node, idx) => {
    // note部分
    if (node.classList.contains('row') && node.classList.contains('with-border')) {
      return prev.concat(`${node.textContent.replace(/\r?\n/g, '')}<br>\n\n\n`)
    } else if (node.classList.contains('row') && !node.classList.contains('by-date')) {
      // ハイライト部分
      return prev.concat(`> ${node.textContent.replace(/\r?\n/g, '')}\n\n`)
    } else if (node.localName === 'h2') {
      // h2要素
      return prev.concat(`\n## ${node.textContent.replace(/\r?\n/g, '')}\n\n`)
    } else {
      // TODO: ページ部分の対応について
      return prev
    }
  }, '')
  return text
}

// 配列内の要素を [[h2, div, div, div], [h2, div], ...] のようにh2を基準に分割する
siblings.reduce((acc, item, idx) => {
  if (item.localName === 'h2' && idx != 0) {
    devidedArray.push(acc)
    acc = []
  }
  acc.push(item)
  return acc
}, [])

let output = devidedArray.reduce((prev, elements) => {
  return prev.concat(toTextStrings(elements))
}, '')


// 出力文字列作成処理
fs.writeFileSync('output.md', output, (err) => {
  if (err) { throw err; }
});

