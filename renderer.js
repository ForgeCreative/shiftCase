// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {clipboard} = require('electron')
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const clipboardEvent = require('electron-clipboard-extended')
//clipboard.writeText('Example String')

const state = {
    currentClipboardText: ''
}

clipboardEvent.on('text-changed', () => {
    let currentText = clipboard.readText()
    if (currentText.length > 15) {
        currentText = currentText.slice(0, 35)
    }

    let myNotification = new Notification('Added to the clipboard', {
        body: currentText
    })
    document.querySelector('.clipboard-text').innerHTML = currentText;
    state.currentClipboardText = currentText;
}).startWatching();

const textWithoutFormats = (string) => {
    const textWithoutLineBreaks = string.replace(/\n|\r/g, " ");
    const finalText = textWithoutLineBreaks.replace(/ +(?= )/g,'').trim();
    const removeLeadingSpace = finalText.replace(/^\s+/g, '');
    return removeLeadingSpace;
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
})

document.querySelector('.lowercase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const string = state.currentClipboardText;
        const text = textWithoutFormats(string)
        clipboard.writeText(text.toLowerCase())
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into uppercase"
        })
    }
})

document.querySelector('.titleCase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const string = state.currentClipboardText;
        const text = textWithoutFormats(string)
        const titleCase = text.replace(/\b\w/g, l => l.toUpperCase())
        clipboard.writeText(titleCase)
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into uppercase"
        })
    }
})

document.querySelector('.statementCase-func').addEventListener('click', () => {
    console.log('statementCase')
    if(state.currentClipboardText !== '') {
        const string = state.currentClipboardText;
        const text = textWithoutFormats(string);
        const textStatementCase = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        clipboard.writeText(textStatementCase)
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into uppercase"
        })
    }
})


/*
setInterval(() => {
    const clipboardText = clipboard.readText();
    console.log(clipboardText);
}, 500); */

console.log('rendered.js')