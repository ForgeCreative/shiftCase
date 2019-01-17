// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {clipboard} = require('electron')
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const clipboardEvent = require('electron-clipboard-extended')

String.prototype.toTitleCase = function() {
  var i, j, str, lowers, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
      function(txt) {
        return txt.toLowerCase();
      });

  uppers = ['Id', 'Tv'];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
      uppers[i].toUpperCase());

  return str;
}

const state = {
    currentClipboardText: '',
    selectedType: '',
    notifications: false,
}

window.onload = () => {
    let currentClipboard = clipboard.readText();
    let text = textWithoutFormats(currentClipboard)
    state.currentClipboardText = text;
    document.querySelector('.clipboardText').innerHTML = sliceText(text);
}

const sliceText = (text) => {
    if (text.length > 55) {
        text = text.slice(0, 100) + "..."
        return text;
    } else {
        return text;
    }
}

clipboardEvent.on('text-changed', () => {
    let currentText = clipboard.readText()

    if (state.notifications) {
        let myNotification = new Notification('Added to the clipboard', {
            body: currentText
        })
    }
    
    document.querySelector('.clipboardText').innerHTML = textWithoutFormats(sliceText(currentText));
    state.currentClipboardText = textWithoutFormats(currentText);
}).startWatching();

const textWithoutFormats = (string) => {
    const textWithoutLineBreaks = 
        string.replace(/\n|\r/g, " ")
            .replace(/ +(?= )/g,'').trim()
            .replace(/^\s+/g, '')
            .replace(/\s+/g, " ");
    return textWithoutLineBreaks;
}

document.querySelector('.uppercase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const string = state.currentClipboardText;
        const text = textWithoutFormats(string)
        clipboard.writeText(text.toUpperCase())
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into uppercase"
        })
    }
    state.selectedType = 'uppercase';
})

document.querySelector('.lowercase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const string = state.currentClipboardText;
        const text = textWithoutFormats(string)
        clipboard.writeText(text.toLowerCase())
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into lowercase"
        })
    }
    state.selectedType = 'lowercase';
})

document.querySelector('.titleCase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const string = state.currentClipboardText;
        const text = textWithoutFormats(string.toLowerCase())
        const titleCase = text.toTitleCase();
        clipboard.writeText(titleCase)
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into title case"
        })
    }
    state.selectedType = 'statementcase'
})

document.querySelector('.statementCase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const string = state.currentClipboardText;
        const text = textWithoutFormats(string);
        const textStatementCase = text.replace(/(^|\. *)([a-z])/g, l => l.toUpperCase());
        clipboard.writeText(textStatementCase)
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into statement case"
        })
    }
    state.selectedType = 'titlecase'
})