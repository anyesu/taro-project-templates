const path = require('path')

function createWhenTs (err, params) {
  return !!params.typescript
}

function normalizePath (path) {
  return path.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
}

const SOURCE_ENTRY = '/src'
const PAGES_ENTRY = '/src/pages'

const handler = {
  '/tsconfig.json': createWhenTs,
  '/types/global.d.ts': createWhenTs,
  '/src/pages/index/index.jsx' (err, { pageName = '', pageDir = '', subPkg = '' }) {
    return {
      setPageName: normalizePath(path.join(PAGES_ENTRY, pageDir, pageName, `${pageName}.jsx`)),
      setSubPkgName: normalizePath(path.join(SOURCE_ENTRY, subPkg, pageDir, pageName, `${pageName}.jsx`))
    }
  },
  '/src/pages/index/index.css' (err, { pageName = '', pageDir = '', subPkg = '' }) {
    return {
      setPageName: normalizePath(path.join(PAGES_ENTRY, pageDir, pageName, `${pageName}.css`)),
      setSubPkgName: normalizePath(path.join(SOURCE_ENTRY, subPkg, pageDir, pageName, `${pageName}.css`))
    }
  },
  '/src/pages/index/index.config.js' (err, { pageName = '', pageDir = '', subPkg = '' }) {
    return {
      setPageName: normalizePath(path.join(PAGES_ENTRY, pageDir, pageName, `${pageName}.config.js`)),
      setSubPkgName: normalizePath(path.join(SOURCE_ENTRY, subPkg, pageDir, pageName, `${pageName}.config.js`))
    }
  },
  '/_eslintrc' () {
    return { setPageName: `/.eslintrc` }
  },
  '/_gitignore' () {
    return { setPageName: `/.gitignore` }
  },
  '/_editorconfig' () {
    return { setPageName: `/.editorconfig` }
  }
};

const basePageFiles = [
  "/src/pages/index/index.jsx",
  "/src/pages/index/index.css",
];

module.exports = {
  desc: "使用 taro-hooks 的模板",
  handler,
  basePageFiles,
  platforms: ["React"],
};
