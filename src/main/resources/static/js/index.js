document.addEventListener("DOMContentLoaded", showFiles);
document.querySelector("#upload-input").onchange = function () {
    document.querySelector("#file-name").textContent = this.files[0].name;
}


async function showFiles() {
    const files = await getFiles();
    document.getElementById("fileList").innerHTML = "";
    for (const file of files) {
        let card = document.createElement("div");
        card.className = "card my-2";

        let cardBody = document.createElement("div");
        cardBody.className = "card-body ";

        let divElement = document.createElement("div");
        divElement.className = "d-flex";

        let h5Element = document.createElement("h5");
        h5Element.className = "card-title d-inline mr-auto overflow-hidden";
        h5Element.textContent = file.name;

        let h6Element = document.createElement("h6");
        h6Element.className = "card-subtitle";
        h6Element.textContent = file.type;

        let buttonElement = document.createElement("button");
        buttonElement.id = file.id;
        buttonElement.className = "btn btn-danger d-inline ml-auto";
        buttonElement.type = "button";
        buttonElement.textContent = "Delete";

        let aElement = document.createElement("a");
        aElement.className = 'card-link d-inline-block pt-2';
        aElement.href = file.url;
        aElement.text = "Download file";

        divElement.appendChild(h5Element);
        divElement.appendChild(buttonElement);
        cardBody.appendChild(divElement);
        cardBody.appendChild(h6Element);
        cardBody.appendChild(aElement)
        card.appendChild(cardBody);
        document.getElementById("fileList").appendChild(card);
        document.getElementById(file.id).addEventListener("click", async function (){
            await deleteFileById(file.id);
        });
    }
}

async function getFiles() {
    const response = await fetch('http://192.168.1.42:8080/files', {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        }
    })
    return response.json();
}

async function addFile() {
    let input = document.querySelector('input[type="file"]');
    let data = new FormData();
    data.append('file', input.files[0]);
    await fetch('/upload', {
        method: 'POST',
        body: data
    }).then(response => {
        if (response.status == 200) {
            $("#successModal").modal('show');
        }
    })
}

function reloadPage() {
    location.reload();
}

async function printAllFiles() {
    const response = await fetch('http://192.168.1.42:8080/printAll', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        }
    })
    return response.json();
}

async function deleteFileById(id) {
    const response = await fetch('http://192.168.1.42:8080/files/' + id, {
        'method': 'DELETE',
        'headers': {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        reloadPage();
    })
    return response.json();
}