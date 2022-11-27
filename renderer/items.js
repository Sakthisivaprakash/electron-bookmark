// Dom Nodes
let items = document.getElementById('items');

//  Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

//  persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

//  Add new Item
exports.addItem = (item, isNew = false) => {
    // Create a new DOM node
    let itemNode = document.createElement('div');

    itemNode.setAttribute('class', 'read-item');

    itemNode.innerHTML = `<img src="${item.screenshot}" /><h2>${item.title}</h2>`;

    items.appendChild(itemNode)

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