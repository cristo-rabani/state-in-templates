Package.describe({
  name: 'cristo:state-in-templates',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'this package brings state functionality to the blaze templates',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use(['ecmascript', 'templating', 'reactive-var', 'reactive-dict'], 'client');
  api.mainModule('state-in-templates.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cristo:state-in-templates');
  api.mainModule('state-in-templates-tests.js');
});
