const fileInput = document.getElementById('txtPicker');
let sortedMatrix = Array.from({ length: 100 }, () => []);

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            let content = e.target.result;
            content = content.split(":::");
            for (var i = 0; i < content.length; i++) {
              for (var j = 0; j < 100; j++) {
                if (content[i].startsWith(j)) {
                  sortedMatrix[j].push(content[i].replace(j + "",""));
                }
              }
            }  
        };
        reader.readAsText(file);
        setTimeout(getNextConversation,1);
        
    }
});

function getNextConversation() {
  const listContainer = document.getElementById("currentConversation");
  
  // 1. Clear the last conversation immediately
  listContainer.innerHTML = ""; 

  for (var j = 0; j < 100; j++) {
    console.log(sortedMatrix);
    if (sortedMatrix[j][sortedMatrix[j].length-1].startsWith("s ")) {
      
      sortedMatrix[j].forEach((item) => {
        let li = document.createElement("li");
        li.innerText = item;
        listContainer.appendChild(li);
      });
      
      break; // Exit loop after finding and displaying one conversation
    }
  }
}

function checkID() {
  if (document.getElementById("chatterID").value == "a" || document.getElementById("chatterID").value == "s") {
    document.getElementById("txtPicker").style.display = "inline-block";
  }
}

setInterval(checkID, 50);