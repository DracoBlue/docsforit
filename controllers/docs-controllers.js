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
                    cb(content);
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

