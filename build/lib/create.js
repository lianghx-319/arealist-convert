const fs = require("fs-extra")
const chalk = require('chalk')
const inquirer = require('inquirer')
const { resolveDir } = require("../utils")

const resolveTemplate = resolveDir("../../template")
const resolveSrc = resolveDir("../../src")

const copyTemplate = async function (name, template) {
  console.log(`\nCreating ${chalk.cyan(name)}...`)
  await fs.copy(resolveTemplate(template), resolveSrc(`${name}/mobile/area-list.js`))
}

module.exports = async function (name, options) {
  // copy the template in fold src/name
  if (fs.existsSync(resolveSrc(name))) {
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: `Target directory ${chalk.cyan(name)} already exists. Pick an action:`,
      choices: [
        { name: 'Overwrite', value: 'overwrite' },
        { name: 'Merge', value: 'merge' },
        { name: 'Cancel', value: false }
      ]
    })
    if (!action) {
      return
    } else if (action === 'overwrite') {
      console.log(`\nRemoving ${chalk.cyan(name)}...`)
      await fs.remove(resolveSrc(name))
    }
  }

  if (!options.template) {
    const { template } = await inquirer.prompt({
      type: "list",
      name: "template",
      message: `Please select a template:`,
      choices: [
        { name: "Full Chinese area", value: "area.js" },
        { name: "English area", value: "area-en.js" },
        { name: "Simple Chinese area", value: "area.simple.js" },
        { name: "Other", value: false }
      ]
    })
    if (!template) {
      const { inputTemplate } = await inquirer.prompt({
        type: "input",
        name: "inputTemplate",
        message: "Please enter a template file name:"
      })
      if (!fs.existsSync(resolveTemplate(inputTemplate))) {
        console.log(`Template ${chalk.cyan(inputTemplate)} is not exist`)
      } else {
        await copyTemplate(name, inputTemplate)
      }
    } else {
      await copyTemplate(name, template)
    }
  }
}