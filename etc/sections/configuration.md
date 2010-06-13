## Configuration

We have been using the configuration and environment system of the framework
already when creating a working environment for the CombineCss plugin.

At the very moment we will dive into the debugging facilities of the
framework, why logging is important and how easy it is!

All configuration can be made and read everywhere, but it's important for
bootstrap things to be done in the project's `config.js`.

Our's looks like this right now:

    config.setValues({
        "combine_css": {
            "base_url": "{{{base-url}}}"
        }
    });

Every feature of spludo can be figured (even with dependency injection for
many of the core classes) by using the `Config#setValues` method. The method
can be called as many times you want. If the key you want to set, was set
before, you will overwrite the value.

If you know that somebody may do combine_css settings before, and you want
to set **only** the `base_url`, this is how you can do that:

    config.setPathValue(["combine_css", "base_url"], "{{{base-url}}}");

### Debug-Level

One example is the `logging`. We can enable full logging like this:

    config.setValues({
        "logging": {
            "level": 7
        }
    });

Running the application again, will spam us with **lots** of information.
Usually from the CombineCss class. To hide a specific class, you may use the
following snippet:

    config.setValues({
        "logging": {
            "level": 7,
            "hide_classes": [
                "CombineCss"
            ]
        }
    });

Launching the application again now, will show nothing. This is because we have
no special class left, which outputs log information.

### Logging in the DocsManager class

Since we want to have good overview what our application does, we'll add some
logging to our DocsManager.

You may have noticed the line:

    DocsManager.prototype.logging_prefix = 'DocsManager';

in the DocsManager class file at `lib/DocsManager.js`. This is the value, which
the hide_classes property of the logging configuration filters out. Using spaces
here **will** break the filter.

Now open the `lib/DocsManager.js`

    $ {{{text-editor}}} lib/DocsManager.js

and replace:

    DocsManager.prototype.getSectionAsHtml = function(section_name) {
        var self = this;
        return function(cb) {

with:

    DocsManager.prototype.getSectionAsHtml = function(section_name) {
        this.trace("getSectionAsHtml", arguments);
        var self = this;
        return function(cb) {

Relaunching the app and opening {{{base-url}}}docs/extending-the-docs-manager/ will output:

    TRACE [DocsManager.getSectionAsHtml] { '0': 'extending-the-docs-manager' }

If we want to stop the DocsManager from telling us what it does in detail, we
could lower the logging level to something below 6 (TRACE) or add
`"DocsManager"` to the filter at logging hide_classes property.