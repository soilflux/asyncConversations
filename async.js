if (localStorage.getItem("chatterID")) {
  document.getElementById("chatterID").value = localStorage.getItem("chatterID");
}

if (localStorage.getItem("conversations")) {
  document.getElementById("useSavedText").style.display = "inline-block";
}

const fileInput = document.getElementById('txtPicker');
let sortedMatrix = Array.from({ length: 100 }, () => []);

let rawFileContent = "";


let pickedFile = false;
let conversationID = -1;

function useSavedText() {
  rawFileContent = localStorage.getItem("conversations");
  document.getElementById("useSavedText").style.display = "none";
  document.getElementById("txtPicker").style.display = "none";
  document.getElementById("getNextConversation").style.display = "inline-block";
  pickedFile = true;
  processText();
  setTimeout(getNextConversation,10);
}

function processText() {
  let content = rawFileContent.split(":::");
  for (var i = 0; i < content.length; i++) {
    for (var j = 0; j < 100; j++) {
      if (content[i].startsWith(j)) {
        sortedMatrix[j].push(content[i].replace(j + "",""));
      }
    }
  }
}

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {   
          rawFileContent = e.target.result;
          processText();      
        };
        reader.readAsText(file);
        document.getElementById("txtPicker").style.display = "none";
        document.getElementById("getNextConversation").style.display = "inline-block";
        pickedFile = true;
        setTimeout(getNextConversation,100);
        
    }
});

function getNextConversation() {
  console.log(rawFileContent)
  if (conversationID != -1) {
    rawFileContent += ":::" + conversationID + document.getElementById("chatterID").value + " " + document.getElementById("response").innerText + "\n";
    localStorage.setItem("conversations",rawFileContent);
    document.getElementById("response").innerText = "";
  }
  console.log(rawFileContent)
  const listContainer = document.getElementById("currentConversation");
  
  // 1. Clear the last conversation immediately
  listContainer.innerHTML = ""; 

  for (var j = conversationID+1; j < 100; j++) {
    if (!sortedMatrix[j][sortedMatrix[j].length-1].startsWith(document.getElementById("chatterID").value + " ")) {
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

function downloadTextFile() {
    // 1. Create a Blob with the text content
    // We specify the type as 'text/plain'
    const blob = new Blob([rawFileContent], { type: 'text/plain' });

    // 2. Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // 3. Create a hidden <a> element
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    
    // 4. Set the name of the file to be downloaded
    a.download = 'test.txt';

    // 5. Add to page, click it, and remove it
    document.body.appendChild(a);
    a.click();
    
    // 6. Clean up: remove the link and revoke the URL to save memory
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

setInterval(checkID, 50);