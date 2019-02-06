#!/usr/bin/env node

const packageList = [
  'just-diff',
  'just-diff-apply',
  'just-compare',
  'just-pluck-it',
  'just-clone',
  'just-flush',
  'just-extend',
  'just-merge',
  'just-values',
  'just-entries',
  'just-pick',
  'just-omit',
  'just-filter-object',
  'just-map-object',
  'just-reduce-object',
  'just-is-empty',
  'just-is-circular',
  'just-is-primitive',
  'just-safe-get',
  'just-safe-set',
  'just-typeof',
  'just-flip-object',
  'just-unique',
  'just-flatten-it',
  'just-index',
  'just-insert',
  'just-intersect',
  'just-compact',
  'just-last',
  'just-tail',
  'just-random',
  'just-shuffle',
  'just-split',
  'just-split-at',
  'just-partition',
  'just-range',
  'just-remove',
  'just-union',
  'just-zip-it',
  'just-template',
  'just-truncate',
  'just-prune',
  'just-squash',
  'just-left-pad',
  'just-right-pad',
  'just-camel-case',
  'just-kebab-case',
  'just-snake-case',
  'just-pascal-case',
  'just-clamp',
  'just-modulo',
  'just-compose',
  'just-curry-it',
  'just-demethodize',
  'just-flip',
  'just-partial-it',
  'just-debounce-it',
  'just-throttle',
  'just-once'
];

// https://api.npmjs.org/downloads/range/2015-11-01:2015-12-31/just-extend,just-clone

const author = process.argv.slice(2)[0];
// const url = `https://registry.npmjs.org/-/v1/search?text=author:${author}&size=60`;
const url = `https://registry.npmjs.org/-/v1/search?text=keywords:just&size=60`;
require('node-fetch')(url)
  .then(raw => raw.json())
  .then(res => res.objects.map(obj => obj.package.name))
  .then(packages => {
    const counts = require('util').promisify(
      require('npm-package-download-counts')
    );
    const cTable = require('console.table');

    const today = new Date();
    const thisWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 6
    );

    const lastWeekEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    const lastWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 13
    );

    Promise.all([
      counts({
        packages,
        period: `${formatDate(thisWeekStart)}:${formatDate(today)}`
      }),
      counts({
        packages,
        period: `${formatDate(lastWeekStart)}:${formatDate(lastWeekEnd)}`
      })
    ])
      .then(values => {
        // make two dictionaries of pkg->downloads
        // one for this week, one for the week before
        const dicts = values.map(value => {
          return value.reduce((obj, { package, data }) => {
            obj[package] = data.reduce((total, day) => {
              return total + day[1];
            }, 0);
            return obj;
          }, {});
        });
        // smush them together into an array of objects
        let thisWeekTotal = (lastWeekTotal = 0);
        const result = Object.keys(dicts[0]).map(pkg => {
          const thisWeek = dicts[0][pkg];
          const lastWeek = dicts[1][pkg];
          thisWeekTotal += thisWeek;
          lastWeekTotal += lastWeek;
          const diff = thisWeek - lastWeek;
          return {
            pkg,
            thisWeek,
            lastWeek,
            diff,
            'diff%': Math.round(100 * (diff / lastWeek))
          };
        });
        const totalDiff = thisWeekTotal - lastWeekTotal;
        const totals = {
          pkg: 'TOTAL',
          thisWeek: thisWeekTotal,
          lastWeek: lastWeekTotal,
          diff: totalDiff,
          'diff%': Math.round(100 * (totalDiff / lastWeekTotal))
        };
        return [result, totals];
      })
      .then(([result, totals]) => {
        console.table(
          result
            .sort((a, b) => (a.thisWeek > b.thisWeek ? -1 : 1))
            .concat([{ pkg: '================' }, totals])
        );
      });
  });

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
