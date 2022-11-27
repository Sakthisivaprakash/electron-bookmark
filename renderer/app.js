const { ipcRenderer } = require('electron');
const items = require('./items');

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search');

// Filter Items
search.addEventListener('keyup', e => {
    
    // Loop items
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        // Hide items that don't match search value
        let hasMatch = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})

// Navigate Item selection with up/down arrows
document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key);
    }
});

// Toggle Modal Button
const toggleModalButtons = () => {

    // Check state of buttons
    if(addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}

//  Show Modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

// Close Modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
});

//  New Item Handle
addItem.addEventListener('click', e => {
    
    //  Check a url exist
    if(itemUrl.value){
        // console.log(itemUrl.value);
        //  Send new item url to main process
        ipcRenderer.send('new-item', itemUrl.value);

        // Disable Buttons
        toggleModalButtons();
    }
});

//  Listen fro new item from main

ipcRenderer.on('new-item-success', (e, newItem) => {
    console.log(newItem);
    items.addItem(newItem, true);
    // Enable Buttons
    toggleModalButtons();

    //  Hide modal and clear input
    modal.style.display = 'none';
    itemUrl.value = '';
})


// Listen for keyboard submit
itemUrl.addEventListener('keyup', e => {
    if(e.key === 'Enter') addItem.click();
});
