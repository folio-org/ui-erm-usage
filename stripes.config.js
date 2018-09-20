module.exports = {
  'okapi': { 'url': 'http://localhost:9130', 'tenant': 'diku' },
  'config': {
    'logCategories': 'core,path,action,xhr,connect,connect-lifecycle',
    'hasAllPerms': true,
  },
  'modules': {
    '@folio/users': {},
    '@folio/vendors': {},
    '@folio/plugin-find-vendor': {}
  },
};
