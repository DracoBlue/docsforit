## Editing the Sections

### The JsBehaviour Plugin

The js-behaviour plugin is intended to inject (with progressive enhancement)
javascript functionality into a html website.

The basic idea is to use a special html class for dom objects to identify
those elements, which should be enhanced by javascript. As soon as the html
is loaded, the javascript collects those elements and applys the javascript
behaviour to the plain html objects.

Since those objects also need some special parameters, there is a magic and
hidden input field at the beginning of each js-behaviour element, which
contains the json encoded parameters. This element usually gets disposed
as soon as the behaviour is applied.

#### Download the js-behaviour plugin

The plugin can be grabbed from
<http://github.com/DracoBlue/docsforit/tree/master/plugins/js-behaviour>.

#### Enable the plugin

Edit the `views/HtmLayout.ejs`

    $ {{{text-editor}}} views/HtmLayout.ejs
    
and add

    <script type="text/javascript" src="static/js/JsBehaviourToolkit.js"> </script>

after the mootools script tag.


### Behaviour for Docs

#### Render the js-behaviour tag

Add at the beginning of `controllers/docs-controllers.js`

    $ {{{text-editor}}} controllers/docs-controllers.js
    
the following:

    var JsBehaviourToolkit = require("JsBehaviourToolkit");

and replace the controller for the single doc pages with the following:
    
    new Controller(/^docs\/([\w\d\-\/]+)\/$/, {
        "execute": function(params, context) {
            var self = this;
            var section_name = params[1];
            return function(cb) {
                context.layout_name = 'HtmlLayout';
                docs_manager.getSectionAsHtml(section_name)(function(content) {
                    if (content === '') {
                        cb('Section not found!');
                    } else {
                        var element_xml = JsBehaviourToolkit.createElementXml({
                            'tag': 'span',
                            'key': "edit_section",
                            'value': {
                                "section": section_name,
                                "container": "section_content"
                            }
                        });
                        
                        cb('<div class="form-buttons">' + element_xml + '</div><div id="section_content">' + content + '</div>');
                    }
                });
            };
        }
    });
    
#### Register the DocsInlineEditor Behaviour

Create a new file called for the DocsInlineEditor

    $ {{{text-editor}}} static/js/DocsInlineEditor.js
    
with the following content:

    DocsInlineEditor = new Class( {
    
        Implements: [
            Events, Options
        ],
        
        is_open: false,
    
        initialize: function(dom_element, options) {
        
            this.container = $(options.container);
            
            var original_size = this.container.getSize();
    
            this.textarea = new Element('textarea', {
                "class": 'code',
                "style": "width: " + original_size.x + 'px; height: ' + original_size.y + 'px'
            });
            
            this.edit_button = new Element('input', {
                'type': 'button',
                'value': 'edit',
                'events': {
                    'click': function(event) {
                        new Event(event).stop();
                        this.open();
                    }.bind(this)
                }
            });
            this.edit_button.inject(dom_element, 'before');
    
            this.container.addEvent('dblclick', function(event) {
                new Event(event).stop();
                this.open();
            }.bind(this));
            
            this.abort_button = new Element('input', {
                'type': 'button',
                'value': 'abort & close',
                'events': {
                    'click': function(event) {
                        new Event(event).stop();
                        this.close();
                    }.bind(this)
                }
            });
    
            this.abort_button.fade('hide');
            this.abort_button.inject(dom_element, 'before');
            
            this.save_button = new Element('input', {
                'type': 'button',
                'value': 'save & close',
                'events': {
                    'click': function(event) {
                        new Event(event).stop();
                        this.save();
                    }.bind(this)
                }
            });
    
            this.save_button.fade('hide');
            this.save_button.inject(dom_element, 'before');
    
            dom_element.dispose();
    
            this.section_name = options.section;
        },
    
        close: function() {
            var self = this;
            
            if (!this.is_open) {
                return ;
            }
    
            this.textarea.dispose();
            this.save_button.fade('hide');
            this.abort_button.fade('hide');
            this.edit_button.set('disabled', '');
            
            this.is_open = false;
            
            this.container.empty();
    
            var reopen_request = new Request.JSON( {
                'url': 'docs.api.getSectionAsHtml',
    
                'onSuccess': function(section) {
                    self.container.set('html', section.content_html);
                },
    
                'onError': function(event) {
                    new Event(event).stop();
                    throw new Error('Cannot retrieve section content as html for ' + self.section_name);
                }
            });
    
            reopen_request.post( {
                'section': self.section_name
            });
        },
        
        save: function() {
            var self = this;
            
            this.container.empty();
    
            var request = new Request.JSON( {
                'url': 'docs.api.storeSection',
    
                'onSuccess': function(section) {
                    self.close();
                },
    
                'onError': function(event) {
                    new Event(event).stop();
                    throw new Error('Cannot store section content for ' + self.section_name);
                }
            });
    
            request.post( {
                'section': this.section_name,
                'content': this.textarea.get('value')
            });
        },
    
        open: function() {
            var self = this;
    
            if (this.is_open) {
                return ;
            }
            
            this.is_open = true;
            
            this.container.empty();
    
            this.textarea.fade('hide');
            
            this.container.adopt( [
                this.textarea
            ]);
    
            this.edit_button.blur();
            
            var request = new Request.JSON( {
                'url': 'docs.api.getSection',
    
                'onSuccess': function(section) {
                    self.textarea.set('value', section.content);
                    
                    var min_lines = section.content.split("\n").length;
                    
                    if (min_lines < 20) {
                        min_lines = 20;
                    }
                    
                    self.textarea.setStyle('height', min_lines*1.378 + 'em');
                    
                    self.textarea.fade('in');
                    self.save_button.fade('in');
                    self.abort_button.fade('in');
                    self.edit_button.set('disabled', 'disabled');
                },
    
                'onError': function(event) {
                    new Event(event).stop();
                    throw new Error('Cannot retrieve section content for ' + self.section_name);
                }
            });
    
            request.post( {
                'section': this.section_name
            });
            
        }
    });
    
    JsBehaviourToolkit.registerHandler('edit_section', DocsInlineEditor);


Now register the behaviour always, by extending the `views/HtmlLayout.ejs`

    $ {{{text-editor}}} views/HtmLayout.ejs
    
and add

    <script type="text/javascript" src="static/js/DocsInlineEditor.js"> </script>

after the JsBehaviourToolkit script tag.


### Api Functions to get and store sections

Now we have to extend  `controllers/docs-controllers.js` once again

    $ {{{text-editor}}} controllers/docs-controllers.js

This time to add the following new api methods.    

    new Controller("docs.api.getSection", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                var section_name = context.params.section;
                
                docs_manager.getSectionContent(section_name)(function(content) {
                    cb(JSON.stringify({
                        "name": section_name,
                        "content": content
                    }));
                });
            };
        }
    });
    
    new Controller("docs.api.getSectionAsHtml", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                var section_name = context.params.section;
                
                docs_manager.getSectionAsHtml(section_name)(function(content_html) {
                    cb(JSON.stringify({
                        "name": section_name,
                        "content_html": content_html
                    }));
                });
            };
        }
    });
    
    new Controller("docs.api.storeSection", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                var section_name = context.params.section;
                var content = context.params.content;
                
                docs_manager.storeSectionContent(section_name, content)(function(error) {
                    cb(JSON.stringify(error ? false : true));
                });
            };
        }
    });

These functions are generally a restful api, which uses our extended docs_manager.

### Extending the DocsManager.js

Edit the `lib/DocsManager.js`

    $ {{{text-editor}}} lib/DocsManager.js

and add those two new methods to the class:

    DocsManager.prototype.getSectionContent = function(section_name) {
        var self = this;
        return function(cb) {
            self.trace("getSectionContent", section_name);
            fs.readFile(__dirname + '/../etc/sections/' + section_name + '.md', function(error, content) {
                if (error) {
                    cb('');
                } else {
                    cb(content.toString());
                }
            });
        };
    };
    
    DocsManager.prototype.storeSectionContent = function(section_name, content) {
        var self = this;
        return function(cb) {
            self.trace("storeSectionContent", section_name, content);
            fs.writeFile(__dirname + '/../etc/sections/' + section_name + '.md', content, 'utf8', function (error) {
                cb(error);
            });
        };
    };