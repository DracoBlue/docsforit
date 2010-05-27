var JsBehaviourToolkit = require("JsBehaviourToolkit");

new Controller("docs/", {
    "execute": function(params, context) {
        var self = this;
        return function(cb) {
            context.layout_name = 'HtmlLayout';
            cb('<h2>' + StringToolkit.encodeXml(docs_manager.getName()) + '</h2>');
        };
    }
});

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

new Controller("docs._sections/", {
    "execute": function(params, context) {
        var self = this;
        return function(cb) {
            docs_manager.getSections()(function(sections) {
                var sections_length = sections.length;
                
                var html = [ ];
                
                html.push("<ul>");
                
                for (var i = 0; i < sections_length; i++) {
                    html.push("<li>");
                    html.push("<a href=\"");
                    html.push("docs/" + StringToolkit.encodeXml(sections[i][1]) + "/");
                    html.push("\">");
                    html.push(StringToolkit.encodeXml(sections[i][0]));
                    html.push("</a>");
                    html.push("</li>");
                }
                
                html.push("</ul>");
                
                cb(html.join(""));
            });
        };
    }
});




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

