# Pytutor

Web-based python tutorial tool. Runs Python code in the browser using [Brython](http://www.brython.info).

Release versions require no software except the browser. If run locally it does not require an internet connection either.

## Writing assignments

A set of assignments is written as a [HanSON](https://github.com/timjansen/hanson) file. HanSON is basically more friendly JSON with support for multiline strings using backticks(<code>`</code>) as the string delimiter.

The assignment file is a list of assignment objects. An assignment object has the following properties:

- **title:** The title of the assignment.
- **text:** The textual content of the assignment. Uses [Markdown syntax](http://daringfireball.net/projects/markdown/syntax) with GFM extensions.
- **code:** Optional. If defined it is inserted into the code editor when the assignment is first loaded. Leaving this out hides the console and code editor.

## Known issues

Long calculations and infinite loops are impossible to interrupt without killing the page/tab. Unfortunately this is a consequence of how Brython is intended to be used, and as such seems to be unfixable for now.

In connection to the previous issue; all output from a script will appear at once, as Brython freezes the UI until finished.

Currently the only implemented UI language is Norwegian, but full localization options are planned.