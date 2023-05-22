#!/usr/bin/env node
import commander from 'commander'
import fs from 'fs'

import { denormalise, groupEntitiesByLayer, parseString, toSVGs } from './'

commander
  .version(require('../package.json').version)
  .description('Converts a dxf file to a svg file.')
  .arguments('<dxfFile> [outputDirectory]')
  .option('-v --verbose', 'Verbose output')
  .action((dxfFile, outputDirectory, options) => {
    const parsed = parseString(fs.readFileSync(dxfFile, 'utf-8'))

    if (options.verbose) {
      const groups = groupEntitiesByLayer(denormalise(parsed))
      console.log('[layer : number of entities]')
      Object.keys(groups).forEach((layer) => {
        console.log(`${layer} : ${groups[layer].length}`)
      })
    }

    const svgsData = toSVGs(parsed)

    for (const {layer, data} of svgsData) {
      fs.writeFileSync(`${outputDirectory}${layer}.svg`, data, 'utf-8')
    }
  })
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  commander.help()
}
