const fs = require("fs-extra")
const chalk = require('chalk')
const inquirer = require('inquirer')
const toAST = require("to-ast")
const escodegen = require("escodegen")
const { resolveDir, convertArea } = require("../utils")

const resolveSrc = resolveDir("../../src")
const resolveTemplate = resolveDir("../../template")

const moduleTemplate = resolveTemplate("module_template.js.tml")

module.exports = function (name, options) {
  console.log(`\nConverting ${chalk.cyan("area-list")} for pc...`)
  const resolveSrcMobile = resolveSrc(`${name}/mobile/area-list.js`)
  const resolveSrcPC = resolveSrc(`${name}/pc/area-list.js`)

  const objTml = fs.readFileSync(moduleTemplate, "utf-8")

  const mobileArea = require(resolveSrcMobile)
  const pcArea = convertArea(mobileArea)
  const ast = toAST(pcArea)
  let code = escodegen.generate(ast)
  code = objTml.replace(/\%\%areaList\%\%/, code)
  fs.outputFile(resolveSrcPC, code)
}