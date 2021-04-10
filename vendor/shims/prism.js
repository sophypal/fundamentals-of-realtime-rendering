(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['Prism'],
      __esModule: true,
    };
  }

  self.Prism.plugins.autoloader.languages_path = '/prism-components/';
  define('prism', [], vendorModule);
})();
