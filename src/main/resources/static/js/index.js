document.querySelector("#upload-input").onchange = function () {
    document.querySelector("#file-name").textContent = this.files[0].name;
}
