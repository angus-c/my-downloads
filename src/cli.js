#!/usr/bin/env node

const minimist = require('minimist');
const cTable = require('console.table');
const api = require('./api');

const args = minimist(process.argv.slice(2));
const searchMask = args['_'][0];

api({ searchMask, sortBy: args.sort, direction: args.direction })
  .then(({ details, totals }) => {
    console.table(details.concat([{ pkg: '================' }, totals]));
  })
  .catch(e => console.log(e.message));
