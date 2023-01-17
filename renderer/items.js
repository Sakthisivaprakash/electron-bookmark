const { shell } = require('electron');
const fs = require('fs');
// Dom Nodes
let items = document.getElementById('items');

// Get readrJs
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString();
})

//  Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// Listen for "done" message from reader window
window.addEventListener('message', e => {
    // Check for correct message
    if(e.data.action === 'delete-reader-item') {
        // Delete item at given index
        this.delete(e.data.itemIndex);

        // Close the reader window
        console.log(e.source);
        e.source.close()
    }
});

exports.delete = itemIndex => {

    // Remoce item from DOM
    items.removeChild(items.childNodes[itemIndex]);

    // Remove item from storage
    this.storage.splice(itemIndex, 1);

    // Persist Storage
    this.save();

    // Select previous item or new top item
    if(this.storage.length){

        // Get new selected item idx
        let = newSelectedItemIndex = (itemIndex === 0) ? 0: itemIndex - 1;

        // Select item at new index
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected');
    }
}

// Get selected item index
exports.getSelectedItem = () => {

    // get selected node
    let currentItem  = document.getElementsByClassName('read-item selected')[0];

    // GEt item idx
    let itemIndex = 0;
    let child = currentItem;
    while((child = child.previousElementSibling) != null) itemIndex++;

    // Return selected item and index
    return {
        node: currentItem, index: itemIndex
    }
}

//  persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

//  Set item as selected
exports.select = e => {
    //  Remove currently selected item class
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected');

    // Add to clicked item
    e.currentTarget.classList.add('selected');
}

//  Move to newly selected item
exports.changeSelection = direction => {

    // Get Selected item
    // let currentItem = document.getElementsByClassName('read-item selected')[0];
    let currentItem = this.getSelectedItem();

    // Handle up/down
    if(direction === 'ArrowUp' && currentItem.node.previousElementSibling) {
        currentItem.node.classList.remove('selected');
        currentItem.node.previousElementSibling.classList.add('selected');
    } else if(direction === 'ArrowDown' && currentItem.node.nextElementSibling) {
        currentItem.node.classList.remove('selected');
        currentItem.node.nextElementSibling.classList.add('selected');
    }
}

// Open Selected item in native browser
exports.openNative = () => {
    //  Only if we have items (in case of menu open)
    if(!this.storage.length) return;

    // get selected item
    let selectedItem = this.getSelectedItem();

    // get items url
    let contentURL = selectedItem.node.dataset.url;

    // Open in users default browser
    shell.openExternal(contentURL);
}

//  open selecte item
exports.open = () => {

    //  Only if we have items (in case of menu open)
    if(!this.storage.length) return;

    // get selected item
    let selectedItem = this.getSelectedItem();

    // get items url
    let contentURL = selectedItem.node.dataset.url;

    // Open item in proxt window
    console.log('Opening item:', contentURL);
    let readerWin = window.open(contentURL, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#dedede,
        nodeIntegeration=0,
        contextIsolation=1
    `);

    // Inject JS with specific item index (selecteITem.index)
    readerWin.eval(readerJS.replace('{{index}}', selectedItem.index));
}

//  Add new Item
exports.addItem = (item, isNew = false) => {
    // Create a new DOM node
    let itemNode = document.createElement('div');

    itemNode.setAttribute('class', 'read-item');

    // set item url as data attribute
    itemNode.setAttribute('data-url', item.url);

    itemNode.innerHTML = `<img src="${item.screenshot}" /><h2>${item.title}</h2>`;

    items.appendChild(itemNode)

    // Attach click handler to select
    itemNode.addEventListener('click', this.select);

    // Attach double click handler to open
    itemNode.addEventListener('dblclick', this.open);

    // If this is the first item, select it
    if(document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }

    // Add item to storage and persist
    if(isNew) {
        this.storage.push(item);
        this.save();
    }
        
}

// Add Items from storage when app loads
this.storage.forEach(item => {
    this.addItem(item);
});