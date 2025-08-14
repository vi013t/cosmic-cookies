const itemName = getServerData("item");

select("*[data-item-name]", element => (element.textContent = itemName));
