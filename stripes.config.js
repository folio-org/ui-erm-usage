module.exports = {
  'okapi': { 'url': 'http://localhost:9130', 'tenant': 'diku' },
  'config': {
    'logCategories': 'core,path,action,xhr,connect,connect-lifecycle'
  },
  'modules': {
    '@folio/users': {},
    '@folio/vendors': {},
    'plugin-find-vendor': {}
  },
};
