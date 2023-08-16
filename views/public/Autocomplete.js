
function addressAutocomplete(containerElement, callback, options) {

    const MIN_ADDRESS_LENGTH = 3;
    const DEBOUNCE_DELAY = 300;

    
    const inputContainerElement = document.createElement("div");
    inputContainerElement.setAttribute("class", "input-container");
    containerElement.appendChild(inputContainerElement);

   
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("id", "textfield1");
    inputElement.setAttribute("placeholder", options.placeholder);
    inputContainerElement.appendChild(inputElement);

   
    const clearButton = document.createElement("div");
    clearButton.classList.add("clear-button");
    addIcon(clearButton);
    clearButton.addEventListener("click", (e) => {
        e.stopPropagation();
        inputElement.value = '';
        callback(null);
        clearButton.classList.remove("visible");
        closeDropDownList();
    });
    inputContainerElement.appendChild(clearButton);

   
    let currentTimeout;

    
    let currentPromiseReject;

   
    let focusedItemIndex;

    
    inputElement.addEventListener("input", function (e) {
        const currentValue = this.value;

      
        closeDropDownList();


        
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }

       
        if (currentPromiseReject) {
            currentPromiseReject({
                canceled: true
            });
        }

        if (!currentValue) {
            clearButton.classList.remove("visible");
        }

      
        clearButton.classList.add("visible");

     
        if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
            return false;
        }

   
        currentTimeout = setTimeout(() => {
            currentTimeout = null;

          
            const promise = new Promise((resolve, reject) => {
                currentPromiseReject = reject;

              
                const apiKey = "b5ccc701212d45658ee3cc25830021f7";

                var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${apiKey}`;

                fetch(url)
                    .then(response => {
                        currentPromiseReject = null;

                        
                        if (response.ok) {
                            response.json().then(data => resolve(data));
                        } else {
                            response.json().then(data => reject(data));
                        }
                    });
            });

            promise.then((data) => {
               
                currentItems = data.results;

               
                const autocompleteItemsElement = document.createElement("div");
                autocompleteItemsElement.setAttribute("class", "autocomplete-items");
                inputContainerElement.appendChild(autocompleteItemsElement);

              
                data.results.forEach((result, index) => {
                  
                    const itemElement = document.createElement("div");
                   
                    itemElement.innerHTML = result.formatted;
                    autocompleteItemsElement.appendChild(itemElement);

                  
                    itemElement.addEventListener("click", function (e) {
                        inputElement.value = currentItems[index].formatted;
                        callback(currentItems[index]);
                     
                        closeDropDownList();
                    });
                });

            }, (err) => {
                if (!err.canceled) {
                    console.log(err);
                }
            });
        }, DEBOUNCE_DELAY);
    });

 
    inputElement.addEventListener("keydown", function (e) {
        var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
        if (autocompleteItemsElement) {
            var itemElements = autocompleteItemsElement.getElementsByTagName("div");
            if (e.keyCode == 40) {
                e.preventDefault();
               
                focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
              
                setActive(itemElements, focusedItemIndex);
            } else if (e.keyCode == 38) {
                e.preventDefault();

              
                focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
                
                setActive(itemElements, focusedItemIndex);
            } else if (e.keyCode == 13) {
                
                e.preventDefault();
                if (focusedItemIndex > -1) {
                    closeDropDownList();
                }
            }
        } else {
            if (e.keyCode == 40) {
               
                var event = document.createEvent('Event');
                event.initEvent('input', true, true);
                inputElement.dispatchEvent(event);
            }
        }
    });

    function setActive(items, index) {
        if (!items || !items.length) return false;

        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove("autocomplete-active");
        }

      
        items[index].classList.add("autocomplete-active");

      
        inputElement.value = currentItems[index].formatted;
        callback(currentItems[index]);
    }

    function closeDropDownList() {
        const autocompleteItemsElement = inputContainerElement.querySelector(".autocomplete-items");
        if (autocompleteItemsElement) {
            inputContainerElement.removeChild(autocompleteItemsElement);
        }

        focusedItemIndex = -1;
    }

    function addIcon(buttonElement) {
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgElement.setAttribute('viewBox', "0 0 24 24");
        svgElement.setAttribute('height', "24");

        const iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
        iconElement.setAttribute('fill', 'currentColor');
        svgElement.appendChild(iconElement);
        buttonElement.appendChild(svgElement);
    }

   
    document.addEventListener("click", function (e) {
        if (e.target !== inputElement) {
            closeDropDownList();
        } else if (!containerElement.querySelector(".autocomplete-items")) {
          
            var event = document.createEvent('Event');
            event.initEvent('input', true, true);
            inputElement.dispatchEvent(event);
        }
    });
}

addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
    console.log("Selected option: ");
    console.log(data);
}, {
    placeholder: "Enter city name here"
});


