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

function reportNoMatches(searchMask) {
  console.log(`Sorry, no matches for "${searchMask}".`);
  if (searchMask.indexOf('-') > -1 && searchMask.indexOf('maintainer') == -1) {
    console.log(
      `This may be due to the hyphen. Try "maintainer:${searchMask.slice(
        searchMask.indexOf(':') + 1
      )}" instead.`
    );
  }
}
