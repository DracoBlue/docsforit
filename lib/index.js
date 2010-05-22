bootstrap_manager.whenReady(["plugin.combine-css"], function() {
    combine_css.addFile('static/css/screen/reset.css', 'screen.css', 'screen');
    combine_css.addFile('static/css/screen/base.css', 'screen.css', 'screen');
});

bootstrap_manager.whenReady(["plugin.markdown-views"], function() {
    require("./DocsManager");
    docs_manager = new DocsManager('DocsForIt!');
});