module.exports = {
  'okapi': { 'url': 'http://localhost:9130', 'tenant': 'diku' },
  'config': {
    'hasAllPerms': true,
    'logCategories': 'core,path,action,xhr,connect,connect-lifecycle'
  },
  'modules': {
    'plugin-find-vendor': {},
    '@folio/vendors': {}
  }
};
