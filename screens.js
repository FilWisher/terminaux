"use strict";


var h = require("virtual-dom/h");

module.exports = {
    home: home,
    about: about,
    generic: generic,
    contact: contact
};

// home
function home () {
    
    return h("div", [
         
        h("h2", "FilWisher.com"),
        h("p", "William Fisher is an online entity"),
        h("br"),
        h("p", "Type `help` or `commands` for help!")
    ]);
}

// me section
function about () {

    return h("h1", "This is the kind of work I do");
}

function contact () {
    
    return h("h1", "You can contact me in this way");
}

// work section
function work () {

    return h("h1", "I write small open source Javascript and Node modules");
}

// default
function generic () {

    return h("h1", "I didn't recognize that screen")
}
