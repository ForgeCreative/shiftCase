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
    let myNotification = new Notification('Added to the clipboard', {
        body: currentText
    })
    document.querySelector('.clipboard-text').innerHTML = currentText;
    state.currentClipboardText = currentText;
    console.log(currentText)
}).startWatching();

document.querySelector('.uppercase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const text = state.currentClipboardText;
        console.log(text)
        clipboard.writeText(text.toUpperCase())
    } else {
        let myNotification = new Notification('Clipboard error', {
            body: "There isn't text to transform into uppercase"
        })
    }
})

document.querySelector('.lowercase-func').addEventListener('click', () => {
    if(state.currentClipboardText !== '') {
        const text = state.currentClipboardText;
        console.log(text)
        clipboard.writeText(text.toLowerCase())
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