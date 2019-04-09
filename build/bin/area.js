#!/usr/bin/env node

const program = require("commander")
const minimist = require("minimist")
const chalk = require("chalk")

const create = require("../lib/create.js")
const convert = require("../lib/convert.js")

program
  .version(require("../../package.json").version)
  .usage("<command> [options]")

program
  .command("new <name>")
  .option("-t, --template <name>", "template of area list for new")
  .action((name, cmd) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the src\'s name, the rest are ignored.'))
    }
    create(name, cleanArgs(cmd))
  })

program
  .command("convert <name>")
  .action((name, cmd) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the src\'s name, the rest are ignored.'))
    }
    convert(name, cleanArgs(cmd))
  })

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`area <command> --help`)} for detailed usage of given command.`)
  console.log()
})

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

program.parse(process.argv)
