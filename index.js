"use strict";


var h = require("virtual-dom/h");
var diff = require("virtual-dom/diff");
var patch = require("virtual-dom/patch");
var createElement = require("virtual-dom/create-element");
var observ = require("observ");
var observStruct = require("observ-struct");
var commands = require("./commands.js");
var screens = require("./screens.js");

function main () {
    
    function user () {
        return "filwisher:~$ ";
    }
  
    var state = observStruct({
        history: observ([
          "Welcome to filwishercom. Type help or commands for help!",
          ""
        ]),
        current: observ(["/"]),
        fs: observStruct({
            "/": {
                "me/": {
                    "about.screen": 1,
                    "contact.screen": 2
                },
                "work/": {
                    "work.screen": 3
                },
                "contact/": {}
            } 
        }),
        screen: observ("home")
    });
  
    var vtree, ntree, initial = true;
    state(function () {
        render();   
    });

    function render () {
         if (initial) {
            vtree = view(state); 
            ntree = createElement(vtree);
            initial = false;
            console.log(ntree);
            return ntree;
         } else {
            var newvtree = view(state); 
            var patches = diff(vtree, newvtree);
            ntree = patch(ntree, patches);
            vtree = ntree;
            document.querySelector("input.cursor").focus()
         }
    }

    try {
        document.querySelector(".terminal-container").appendChild(render());
    } catch (e) {
        console.log(e); 
    }

    function evaluate () {
        var history = state.history();
        var input = document.querySelector(".cursor").value;
        history.push(user() + input);
        state.history.set(history);
       
        var args = input.split(" "); 
        if (commands.hasOwnProperty(args[0])) {
        
            commands[args[0]](args, state);
        }
    }

    function view () {
       
        var renderCurrentScreen = screens[state.screen()];
        if (!renderCurrentScreen) renderCurrentScreen = screens.generic;
        return h("div.container", [
            h("div.terminal-outer", [
                h("div.terminal", [
                    state.history().map(function (command) {
                        return h("div.line", [
                      
                            h("span", command)
                        ]);
                    }),
                    h("div.line", [
                        h("span", user()),
                        h("input.cursor", {
                            autofocus: true,
                            type: "text",
                            placeholder: "_",
                            onkeypress: function (ev) {
                                if (ev.keyCode === 13) {
                                    evaluate();   
                                } 
                            }
                        })
                    ])
                ])
            ]),
            h("div.screen", [
                renderCurrentScreen() 
            ])
        ]);
    }
}

main();
