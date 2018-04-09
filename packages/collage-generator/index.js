const pkg = require("../package.json")
const { resolve } = require("path")
const os = require("os")
const { URL } = require("url")

const { mkdtemp } = require("fs-extra")
const _ = require("lodash")
const fetch = require("cross-fetch")
const execa = require("execa")
const del = require("del")
const inquirer = require("inquirer")

const DEFAULT_URL = "https://focus-tester-server.now.sh/db"

const FILE_QUESTION = { type: "input", filter: path => resolve(path).trim() }
const URL_QUESTION = { type: "input", filter: url => new URL(url.trim()).href }

void (async () => {
  let tmpdir

  try {
    const { src, dst, url } = await inquirer.prompt([
      { ...FILE_QUESTION, name: "src", message: " Input file" },
      { ...FILE_QUESTION, name: "dst", message: "Output file" },
      {
        ...URL_QUESTION,
        name: "url",
        message: "Service URL",
        default: DEFAULT_URL
      }
    ])

    console.log("Getting information...")
    const data = await fetch(url).then(res => res.json())
    const subdivisions = data.startInfo.subdivisions

    console.log("Creating tiles...")

    tmpdir = await mkdtemp(resolve(os.tmpdir(), pkg.name))
    console.log("Temporary dir:", tmpdir)

    await execa(
      "convert",
      [
        src,
        ...`-crop ${subdivisions}x${subdivisions}@ +repage +adjoin %d.jpg`.split(
          " "
        )
      ],
      { cwd: tmpdir, stdio: "inherit" }
    )

    console.log("Processing view time")
    const images = _(data.timers)
      .sortBy("serverTime")
      .reverse()
      .map(timer => resolve(tmpdir, `${timer.id}.jpg`))
      .value()

    console.log("Creating collage...")
    await execa("montage", [...images, ..."-geometry +0+0".split(" "), dst], {
      stdio: "inherit"
    })

    console.log("Finished")
  } catch (err) {
    console.log(err)
  } finally {
    if (tmpdir) {
      console.log("Cleaning up...")
      await del(tmpdir, { force: true })
    }

    process.exit(0)
  }
})()
