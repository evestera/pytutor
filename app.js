var assignments = {};
var hanson = this.HanSON;

$.ajax({
	url: 'assignments.hson',
	type: 'get',
	async: false,
	success: function(data) {
		assignments = hanson.parse(data);
	}
});

var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	lineNumbers: true
});

editor.setOption("extraKeys", {
	'Ctrl-R': function(cm) {
		playCode();
	}
});

var init = "import sys\n";
init += "from browser import document\n";
init += "def __to_browser(data):\n";
init += "  c = document['console']\n";
init += "  c.innerText += str(data)\n";
init += "  c.scrollTop = c.scrollHeight\n"
init += "sys.stdout.write = __to_browser\n";
init += "sys.stderr.write = __to_browser\n";
runCode(init);

var assignment = 0;
window.onhashchange = handleHash;
if (window.location.hash.length > 1) {
	handleHash();
} else {
	location.hash = 0;
}

$('#nav .next').click(nextAssignment);
$('#nav .prev').click(prevAssignment);

$('#editor-commands .play').click(playCode);
$('#editor-commands .reset').click(function() {
	editor.setValue(assignments[assignment].code.trim());
});
$('#editor-commands .help').click(function() {
	// TODO: Make actual help content
	window.location = 'http://perso.limsi.fr/pointal/_media/python:cours:mementopython3-english.pdf';
});

function handleHash() {
	var hash = window.location.hash;
	assignment = parseInt(hash.substr(1));
	if (assignment >= assignments.length) assignment = 0;
	loadAssignment(assignment);
}

function nextAssignment() {
	assignment = assignment < assignments.length - 1 ? assignment + 1 : 0;
	location.hash = assignment;
}

function prevAssignment() {
	assignment = assignment > 0 ? assignment - 1 : assignments.length - 1;
	location.hash = assignment;
}

function updateButtons() {
	var next = $('#nav .next');
	var prev = $('#nav .prev')
	if (assignment == 0) {
		prev.hide();
	} else {
		prev.show();
	}
	if (assignment == assignments.length - 1) {
		next.hide();
	} else {
		next.show();
	}
}

function loadAssignment(n) {
	var current = assignments[n];
	$('#assignment-title').html(current.title);
	$('#assignment-text').html(marked(current.text));
	if (current.code === undefined) {
		$('.codestuff').hide();
	} else {
		$('.codestuff').show();
		var userCode = getUserCode(n);
		if (userCode) {
			editor.setValue(userCode);
		} else {
			editor.setValue(assignments[n].code.trim());
		}
	}
	$('#console').html('Trykk på knappen eller Ctrl-R for å kjøre...');
	updateButtons();
	document.title = 'Python Intro - ' + current.title;
}

function getUserCode(n) {
	return localStorage['assignment' + n];
}

function storeUserCode(n, code) {
	localStorage['assignment' + n] = code;
}

function playCode() {
	var code = editor.getValue();
	storeUserCode(assignment, code);
	runCode(code);
	var console = document.getElementById('console');
	console.innerHTML += '\n- Kjøring ferdig. -';
	console.scrollTop = console.scrollHeight;
}

function runCode(code) {
	var console = document.getElementById('console');
	console.innerHTML = '';
	var temptag = document.createElement('script');
	temptag.type = 'text/python';
	temptag.innerHTML = code;
	document.body.appendChild(temptag);
	try {
		brython({debug: 1});
	} finally {
		document.body.removeChild(temptag);
	}
}