"use strict";


var h = require("virtual-dom/h");
var diff = require("virtual-dom/diff");
var patch = require("virtual-dom/patch");
var createElement = require("virtual-dom/create-element");
var observ = require("observ");
var observStruct = require("observ-struct");
var commands = {

    ls: function (args, state) {
        var currentPosition = state.current();
        var fs = state.fs();
        var currentDirectory = currentPosition.reduce(function (a, b) {
            
           if (typeof a === "object" && a.hasOwnProperty(b)) {
                return a[b]; 
           } else {
                return a;
           }
        }, state.fs()); 
        var response = Object.keys(currentDirectory).join("\n");
        var history = state.history();
        history.push(response);
        state.history.set(history);
    },
    cd: function (args, state) {
        var target = args[1]; 
        target += (target !== ".." && target[target.length-1] !== "/") ? "/" : "";
        var fs = state.fs();
        var currentPosition = state.current(); 
        if (typeof fs["/"][target] === "object") {
            currentPosition.push(target); 
            state.current.set(currentPosition); 
        } else if (target === "..") {
            currentPosition.pop();
            state.current.set(currentPosition);
        }
    },
    clear: function (args, state) {
        state.history.set([]);
    },
    mkdir: function (args, state) {
    
        var dirName = args[1];
        //append forward slash for directories
        dirName += (dirName[dirName.length-1] !== "/") ? "/" : "";
        
        var currentPosition = state.current();
        var directory = state.fs();
        var newDirectory = directory;
        // access current folder
        currentPosition.forEach(function (a) {
        
            newDirectory = newDirectory[a];
        }, state.fs());
        // create new
        newDirectory[dirName] = {};
        state.fs.set(directory);
    }
};

function main () {
    
    function user () {
        return "filwisher:~$ ";
    }
  
    var state = observStruct({
        history: observ([]),
        current: observ(["/"]),
        fs: observStruct({
            "/": {
                "documents/": {
                    ".vimrc": 1,
                    "server.js": 2,
                    "package.json": 3
                },
                "projects/": {},
                "contact/": {}
            } 
        })
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
   
       return h("div.terminal", [
     
            
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
       ]); 
    }
}


main();












/* 

var input = document.querySelector("input");

var args;
var argv;

input.addEventListener("keypress", function (v) {
  
 if  (v.which === 13) {
  
  args = input.value;
  argv = args.split(" ");
  input.value = "";
  if (methods.hasOwnProperty(argv[0])) {
    methods[argv[0]]();
  }
 document.querySelector("#cool").textContent = args;
   
 }

});


var terminal = document.querySelector(".terminal");
terminal.scrollTop = terminal.scrollHeight;

var methods = {
  
 ls: function (argv) {
   alert("LSED");
 },
  cd: function (argv) {
    alert("argv[1]");
  },
  pwd: function (argv) {
    alert("PWD");
  }
};
*/
