// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {clipboard} = require('electron')
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const clipboardEvent = require('electron-clipboard-extended')

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
    const textWithoutLineBreaks = string.replace(/\n|\r/g, " ");
    const finalText = textWithoutLineBreaks.replace(/ +(?= )/g,'').trim();
    const removeLeadingSpace = finalText.replace(/^\s+/g, '');
    const removeSpaces = removeLeadingSpace.replace(/\s+/g, " ");
    return removeSpaces;
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
        const titleCase = text.replace(/\b\w/g, l => l.toUpperCase())
        clipboard.writeText(titleCase)
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into title case"
        })
    }
    state.selectedType = 'titlecase'
})

document.querySelector('.statementCase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const string = state.currentClipboardText;
        const text = textWithoutFormats(string);
        const textStatementCase = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        clipboard.writeText(textStatementCase)
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into statement case"
        })
    }

    state.selectedType = 'statementcase'
})