## Markdown files as View

### Install Markdown view support

  [markdown-views-plugin]:
  [plugin-repository]: http://spludo.com/plugins/
  [md-documentation]: http://en.wikipedia.org/wiki/Markdown

If you are fimilar with the [markdown] [md-documentation] syntax and you may
want to use it instead of `.html` or `.ejs` views. Since each view engine
registers on a specific type, we'll add one for `.md` files.

To achieve this, easily grab the [markdown-views plugin]
[markdown-views-plugin] from the [plugin repository] [plugin-repository].

Now you should have a `plugins` folder which looks like this:

    plugins/
        markdown-views/
        ...

### Homepage with markdown

Now we need to use the markdown views. Create a new file called
`views/Homepage.md`:

    $ {{{text-editor}}} views/Homepage.md

with this contents:

    ## Welcome to DocsForIt!
    
    Let's create DocsForIt! Sometimes you have a pretty neat piece of something
    but have no info how to use it.
    
    This small tool helps you to maintain the documentation and collaborate with
    others.
    
    ### Under the hood
    
    The source for DocsForIt! my be found [docsforit github page]
    [docsforit-github] and is released for the public domain.
    
      [docsforit-github]: http://github.com/DracoBlue/docsforit
    
    This application was created by using the [spludo framework] [spludo-framework].
    
     [spludo-framework]: http://spludo.com
                         (A powerful webframework for node.JS)

Update your main-controllers

    $ {{{text-editor}}} controllers/main-controllers.js

for something like this:

    new Controller("", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                context.layout_name = 'HtmlLayout';
                context.view_name = 'Homepage';
                cb();
            };
        }
    });
    
Running the app again with:

    $ node run_server.js
        
Now we see already h2+h3 and the little text as clean html.
    