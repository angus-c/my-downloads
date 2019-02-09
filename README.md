# my-downloads

List download totals and trend for npm packages based on author, maintainer or keyword.\
Use as a CLI or an in-program API

## CLI

### args

**Required:**
* **(unnamed)** `searchMask`\
See https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md\
e.g. `author:<name>`, `maintainer:<name>`, `keywords:<keyword>`, `<generic search term>`\ 

**NOTE:** the npm registry API doesn't currently process hyphenated author names, so if you're searching for an author with a hyphenated name you'll need to use `maintainer:` instead.

**Optional:**
* **--sort**\
Values: `thisWeek` (default), `lastWeek`, `diff` (absolute difference versus last week), `diff%` (percent difference versus last week)

* **--direction**\
Sort direction. Values: `down` (default) or `up`


### globally

#### install

`yarn global add my-downloads` or\
`npm i -g my-downloads`

#### usage

`downloads author:jed`\
(list downloads for packages authored by @jed, default sort is by this week's downloads)

`downloads author:jed --sort 'diff%'`\
(sorts by percent change since last week)\

`downloads author:jed --sort 'diff%' --direction 'up'`\
(sorts by percent change since last week, ascending)\

`downloads maintainer:angus-c`\
(list downloads for packages maintained by @angus-c)

`downloads keywords:bundler`\
(list downloads for packages with the "bundler" keyword)

`downloads pie`\
(list downloads related to pie)

### locally

#### install

`yarn add my-downloads` or\
`npm i my-downloads`

#### usage

`yarn downloads author:jed` or\
`npm downloads author:jed`

etc.\

### API

import downloads from 'my-downloads'

```js
// returns {totals, details}
downloads('author:jed', 'diff%', 'up');\
```






