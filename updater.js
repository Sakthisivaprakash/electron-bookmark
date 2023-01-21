// Electron-Updater Module
const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater")

// Configure log debugging
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

// Single Export to check for and apply any available updates
module.exports = () => {

    // Check for update (GH Releases)
    autoUpdater.checkForUpdates();
    console.log('Checking for updates');

    // Listen for update found
    autoUpdater.on('update-available', () => {
        console.log('update-available');
        // Prompt user to start download
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version of the Bookmark app is available. Do you want to update now?',
            buttons: ['Update', 'No']
        }).then(result => {
            let buttonIndex = result.response;
            // If button 0 (update), start downloading the update
            if(buttonIndex === 0) autoUpdater.downloadUpdate();
        });        
    });

    // Listen for update downloaded
    autoUpdater.on('update-downloaded', () => {
        console.log('update-downloaded');
        // Prompt the user to install the update
        dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'Install & restart now',
            buttons: ['Yes','Later']
        }).then(result => {
            let buttonIndex = result.response;
            // Install & restart if button 0 (Yrs)
            if(buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
        });        
    });
}