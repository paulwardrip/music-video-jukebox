**Journal**

Journal is an extension of the console log for the browser that allows you to use the built in levels of the console logger ['debug', 'info', 'warn', 'error', 'off'] to show only the messages that you want to see. The level defaults to warn, so you know that users coming to your webapp will not have your info or debug logging in their consoles. You still use the console like normal: 

`console.info("message")`



To set the level of messages you can enter this in the console:

`Journal.setLevel("info")`

... or just type: 

`Journal.info()`

That will give you log messages for info and above. The level is saved in localStorage, so that it consistently displays what you want until you set the level again or clear all levels. You can set different levels for a particular function:

`Journal.setLevel('error', 'funcName')`

... or for a particular js file:

`Journal.setLevel('off', null, 'noisy.js')`



Lastly, while Journal filters out messages that don't show up in the console, it still has a record of all the messages that have been logged to the console. If you want to see them you can enter:

`Journal.show()`

This brings up the GUI display of all the messages that were recorded. Searching and filtering of this list are planned for future versions, as is a way to preserve messages across a number of pages / refreshes.