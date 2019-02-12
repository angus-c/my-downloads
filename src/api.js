#!/usr/bin/env node

const fetch = require('node-fetch');
const reduceObject = require('just-reduce-object');

const registryAPI = 'https://registry.npmjs.org/-/v1/';
const downloadsAPI = 'https://api.npmjs.org/downloads/range/';

module.exports = function({ searchMask, sortBy, direction }) {
  return new Promise((resolve, reject) => {
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
          throw new Error(reportNoMatches(searchMask));
        }

        const today = formatDate(new Date());
        const thisWeekStart = formatDate(getDaysFromToday(6));
        const lastWeekEnd = formatDate(getDaysFromToday(7));
        const lastWeekStart = formatDate(getDaysFromToday(13));

        Promise.all([
          fetch(`${downloadsAPI}${thisWeekStart}:${today}/${pkgs.join(',')}`),
          fetch(
            `${downloadsAPI}${lastWeekStart}:${lastWeekEnd}/${pkgs.join(',')}`
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
                'diff%': Math.round(100 * (totalDiff / lastWeekTotal))
              };
            });
            const totalDiff = thisWeekTotal - lastWeekTotal;
            const totalDiffpc = Math.round(100 * (totalDiff / lastWeekTotal));
            const totals = {
              pkg: 'TOTAL',
              thisWeek: thisWeekTotal,
              lastWeek: lastWeekTotal,
              diff: totalDiff,
              'diff%': `${totalDiffpc > 0 ? '+' : ''}${totalDiffpc}`
            };
            return [result, totals];
          })
          .then(([result, totals]) => {
            resolve({
              totals,
              details: result.sort(getSortFunction(sortBy, direction))
            });
          })
          .catch(e => reject(e));
      })
      .catch(e => reject(e));
  });
};

function getDaysFromToday(numberOfDays) {
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - numberOfDays
  );
}

function reportNoMatches(searchMask) {
  const report = [];
  report.push(`Sorry, no matches for "${searchMask}".`);
  if (searchMask.indexOf('-') > -1 && searchMask.indexOf('maintainer') == -1) {
    report.push(
      `This may be due to the hyphen. Try "maintainer:${searchMask.slice(
        searchMask.indexOf(':') + 1
      )}" instead.`
    );
  }
  return report.join('\n');
}

function getSortFunction(sortBy = 'thisWeek', direction = 'down') {
  return direction == 'up'
    ? (a, b) => (a[sortBy] > b[sortBy] ? 1 : -1)
    : (a, b) => (a[sortBy] > b[sortBy] ? -1 : 1);
}

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
