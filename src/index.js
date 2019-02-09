#!/usr/bin/env node

const minimist = require('minimist');
const fetch = require('node-fetch');
const cTable = require('console.table');
const reduceObject = require('just-reduce-object');

const registryAPI = 'https://registry.npmjs.org/-/v1/';
const downloadsAPI = 'https://api.npmjs.org/downloads/range/';

const args = minimist(process.argv.slice(2));
const searchMask = args['_'][0];
const searchURL = `${registryAPI}search?text=${searchMask}&size=60`;

fetch(searchURL)
  .then(raw => raw.json())
  .then(res =>
    res.objects
      .map(obj => obj.package.name)
      .filter(name => name.indexOf('@') === -1)
  )
  .then(pkgs => {
    if (!pkgs || !pkgs.length) {
      reportNoMatches(searchMask);
      return false;
    }

    const today = formatDate(new Date());
    const thisWeekStart = formatDate(getDaysFromToday(6));
    const lastWeekEnd = formatDate(getDaysFromToday(7));
    const lastWeekStart = formatDate(getDaysFromToday(13));

    Promise.all([
      fetch(`${downloadsAPI}${thisWeekStart}:${today}/${pkgs.join(',')}`),
      fetch(`${downloadsAPI}${lastWeekStart}:${lastWeekEnd}/${pkgs.join(',')}`)
    ])
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(values => {
        // make two dictionaries of pkg->downloads
        // one for this week, one for the week before
        const dicts = values.map(value => {
          if (value.error) {
            throw new Error(value.error);
          }
          return reduceObject(
            value,
            (obj, package, details) => {
              details &&
                details.downloads &&
                (obj[package] = details.downloads.reduce(
                  (total, { downloads }) => {
                    return total + downloads;
                  },
                  0
                ));
              return obj;
            },
            {}
          );
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
            .sort(getSortFunction(args.sort, args.direction))
            .concat([{ pkg: '================' }, totals])
        );
      })
      .catch(e => console.log(`Error: ${e.message}`));
  });

function getDaysFromToday(numberOfDays) {
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - numberOfDays
  );
}

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

function getSortFunction(sortBy = 'thisWeek', direction = 'down') {
  return direction == 'up'
    ? (a, b) => (a[sortBy] > b[sortBy] ? 1 : -1)
    : (a, b) => (a[sortBy] > b[sortBy] ? -1 : 1);
}

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
