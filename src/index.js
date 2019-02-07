#!/usr/bin/env node

const fetch = require('node-fetch');
const cTable = require('console.table');

const npmRegistryAddress = 'https://registry.npmjs.org/-/v1/';
const npmDownloadsAddress = 'https://api.npmjs.org/downloads/range/';

const searchMask = process.argv.slice(2)[0];
const searchURL = `${npmRegistryAddress}search?text=${searchMask}&size=60`;

fetch(searchURL)
  .then(raw => raw.json())
  .then(res => res.objects.map(obj => obj.package.name))
  .then(packages => {
    if (!packages || !packages.length) {
      reportNoMatches(searchMask);
      return false;
    }

    const today = new Date();
    const thisWeekStart = getDaysFromToday(6);
    const lastWeekEnd = getDaysFromToday(7);
    const lastWeekStart = getDaysFromToday(13);

    Promise.all([
      fetch(
        `${npmDownloadsAddress}${formatDate(thisWeekStart)}:${formatDate(
          today
        )}/${packages.join(',')}`
      ),
      fetch(
        `${npmDownloadsAddress}${formatDate(lastWeekStart)}:${formatDate(
          lastWeekEnd
        )}/${packages.join(',')}`
      )
    ])
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(values => {
        // make two dictionaries of pkg->downloads
        // one for this week, one for the week before
        const dicts = values.map(value => {
          if (value.error) {
            throw new Error(value.error);
          }
          return Object.keys(value).reduce((obj, package) => {
            obj[package] = value[package].downloads.reduce(
              (total, { downloads }) => {
                return total + downloads;
              },
              0
            );
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

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
