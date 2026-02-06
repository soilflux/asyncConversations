if (localStorage.getItem("chatterID")) {document.getElementById("chatterID").value= localStorage.getItem("chatterID");}

const fileInput = document.getElementById('txtPicker');
let sortedMatrix = Array.from({ length: 100 }, () => []);
let rawFileContent = "";
let pickedFile = false;
let conversationID = -1;

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {   
            rawFileContent = e.target.result;
            let content = rawFileContent.split(":::");
            for (var i = 0; i < content.length; i++) {
              for (var j = 0; j < 100; j++) {
                if (content[i].startsWith(j)) {
                  sortedMatrix[j].push(content[i].replace(j + "",""));
                }
              }
            }  
        };
        reader.readAsText(file);
        document.getElementById("txtPicker").style.display = "none";
        document.getElementById("getNextConversation").style.display = "inline-block";
        pickedFile = true;
        setTimeout(getNextConversation,10);
        
    }
});

function getNextConversation() {
  console.log(rawFileContent)
  if (conversationID != -1) {
    rawFileContent += ":::" + conversationID + document.getElementById("chatterID").value + " " + document.getElementById("response").innerText + "\n";
  }
  console.log(rawFileContent)
  const listContainer = document.getElementById("currentConversation");
  
  // 1. Clear the last conversation immediately
  listContainer.innerHTML = ""; 

  for (var j = conversationID+1; j < 100; j++) {
    console.log(sortedMatrix);
    if (sortedMatrix[j][sortedMatrix[j].length-1].startsWith("s ")) {
      conversationID = j;
      sortedMatrix[j].forEach((item) => {
        let li = document.createElement("li");
        li.innerText = item;
        listContainer.prepend(li); // Adds to the top instead of the bottom
      });
      
      break; // Exit loop after finding and displaying one conversation
    }
  }
}

function checkID() {
  if ((document.getElementById("chatterID").value == "a" || document.getElementById("chatterID").value == "s") && !pickedFile) {
    document.getElementById("txtPicker").style.display = "inline-block";
  }
  localStorage.setItem("chatterID",document.getElementById("chatterID").value);
}

setInterval(checkID, 50);