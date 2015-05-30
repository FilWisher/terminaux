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
