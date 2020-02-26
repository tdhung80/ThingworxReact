;(function (_) { 

  TW.Runtime.Widgets.modernApp = function () {
    var thisWidget = this;
    
    this.renderHtml = () => _.tmpl('<span style="display:none"><script type="text/javascript" src="{{appJS}}"></script></span>', { appJS: _.getURL('app-ccd.js', true) });
  };

}({
  _debug: true,
  _rootURI: 'https://pmq6kp4qqm.csb.app/', // ../Common/extensions/ModernApp/ui/modernApp/

  tmpl: (template, entity) => template.replace(/{{(\w+)}}/g, (m,p) => entity[p] || m),
  getURL: function (relativePath, nocache) {
    return this._rootURI + relativePath + (nocache || this._debug ?  (relativePath.endsWith('&') ? '' : '?') + '_rnd=' + new Date().getTime() : '');
  }
}));