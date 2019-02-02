const packages = [
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

const util = require('util');
const npdc = require('npm-package-download-counts');
const counts = util.promisify(npdc);
const cTable = require('console.table');

const opts = { packages, period: '2019-01-25:2019-01-31' };

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
    return Object.keys(dicts[0]).map(pkg => {
      const thisWeekDownloads = dicts[0][pkg];
      const lastWeekDownloads = dicts[1][pkg];
      const diff = thisWeekDownloads - lastWeekDownloads;
      return {
        pkg,
        thisWeekDownloads,
        lastWeekDownloads,
        diff,
        percentIncrease: Math.round(100 * (diff / lastWeekDownloads))
      };
    });
  })
  .then(result => {
    console.table(
      result.sort((a, b) =>
        a.thisWeekDownloads > b.thisWeekDownloads ? -1 : 1
      )
    );
  });

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
