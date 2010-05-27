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