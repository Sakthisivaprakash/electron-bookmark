const { BrowserWindow } = require('electron');

//  Offscreen Browser Window
let offscreenWindow

//  exported readItem function
module.exports = (url, callback) => {

    // Create OffScreen Window
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    })

    //  Load Item URL
    offscreenWindow.loadURL(url);

    //  Wait for content to finish loading
    offscreenWindow.webContents.on('did-finish-load', e => {

        // Get page Title
        let title = offscreenWindow.getTitle();

        // Get screenshot (thumbnail)
        offscreenWindow.webContents.capturePage().then(image => {
            // Get image as a dataURL
            let screenshot = image.toDataURL();

            // Execute callback with new item object
            callback({title, screenshot, url});
        })

        // Clean up
        offscreenWindow.close();
        offscreenWindow = null;
    })
}