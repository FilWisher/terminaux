"use strict";

module.exports = {
    ls: ls,
    cd: cd,
    mkdir: mkdir,
    clear: clear,
    help: help,
    commands: commands,
    pwd: pwd,
    load: load
};

var commands = {
    commands: "`commands` - displays a list of available commands",
    help: "`help` - displays usage information for a command",
    ls: "`ls` - list the contents of the current directory",
    cd: "`cd <target>` - change to target directory. `cd ..` changes to parent dir",
    mkdir: "`mkdir <target>` - creates new directory in the current location",
    clear: "`clear` - clear the history of the current terminal",
    pwd: "`pwd` - print current directory",
    load: "`load <target>` - load the target .screen panel onto the screen"
};

function ls (args, state) {
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
}

function pwd (args, state) {
    
    var history = state.history();
    var currentPosition = state.current().join("");
    if (currentPosition.length > 1) {
        currentPosition = currentPosition.substr(0, currentPosition.length - 1);
    }
    history.push(currentPosition);
    state.history.set(history);
}

function cd (args, state) {
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
}

function clear (args, state) {
    state.history.set([]);
}

function mkdir (args, state) {

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

function help (args, state) {
  
    var history = state.history();
    if (args.length === 1) {
        history.push("Type `commands` to see list of commands");
        history.push("Or you can type `help <command>` for help with usage.");
    } else {
        var hint = commands[args[1]];
        if (hint) history.push(hint);
        else history.push("That doesn't look familiar. Type commands to see what's available.");
    }
    state.history.set(history);
}

function commands (args, state) {
    
    var history = state.history();
    Object.keys(commands).forEach(function (command) {
        
        var line = commands[command];
        history.push(line);
    });
    state.history.set(history);
}

function load (args, state) {

    var history = state.history();
    var target = args[1];
    target = target.replace(".screen", "");
    history.push("Loading target screen");
    state.screen.set(target);
    state.history.set(history);
}
