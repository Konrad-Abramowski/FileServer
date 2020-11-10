document.addEventListener("DOMContentLoaded", showFiles);

document.querySelector("#upload-input").onchange = function () {
    document.querySelector("#file-name").textContent = this.files[0].name;
}

async function showFiles(){
    const files = await getFiles();
    document.getElementById("fileList").innerHTML = "";
    for(const file of files){
        document.getElementById("fileList").innerHTML +=
            "<li id=\"fileName\" class=\"m-1\">" + file.name + "</li>\n" +
            "<a id=\"fileUrl\" class=\"m-1\" href=" + file.url + ">" + file.url + "</a>\n" +
            "<p class=\"m-1\">Type: " + file.type + "</p>\n" +
            "<p class=\"m-1\">Size: " + file.size + "</p>";
    }
}

async function getFiles(){
    const response = await fetch('http://localhost:8080/files',{
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        }
    })
    return response.json();
}

async function addFile(){
    let input = document.querySelector('input[type="file"]');
    let data = new FormData();
    data.append('file', input.files[0]);
    await fetch('/upload', {
        method: 'POST',
        body: data
    }).then(response => {
        if(response.status == 200){
            $("#successModal").modal('show');
        }
    })
}

function reloadPage(){
    location.reload();
}