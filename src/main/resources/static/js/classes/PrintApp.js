import File from "./File.js";

export default class PrintApp {
    dropzoneForm = document.querySelector('.upload-form')
    uploadInput = this.dropzoneForm.querySelector("#upload-input")
    jqSuccessModal = $("#successModal")

    files = []

    constructor() {
        this.bindUIActions()
        this.appendUploadedPrintListElements()
    }

    /* Set logic for interactions with DOM elements */
    bindUIActions() {
        this.dropzoneForm.querySelector('#uploadFileButton').addEventListener('click', this.uploadFile.bind(this))
        this.dropzoneForm.querySelector('.upload-utils__print-all').addEventListener('click', this.printAllFiles.bind(this))

        this.uploadInput.addEventListener('change', () => {
            this.dropzoneForm.querySelector("#file-name").textContent = this.uploadInput.files[0].name
        })
    }

    /* Create already uploaded */
    async appendUploadedPrintListElements() {
        const filesData = await (
            await fetch('/files', {
                'method': 'GET',
                'headers': {
                    'Content-Type': 'application/json'
                }
            })
        ).json()

        for (const fileConfig of filesData) {
            this.files.push(new File(...Object.values(fileConfig)))
        }
    }

    async uploadFile() {
        const formData = new FormData();

        /* ToDo backend handle multiple files upload */
        for (const file of this.uploadInput.files) {
            formData.append('file', file);
        }

        const uploadResponse = await fetch('/upload', {
            method: 'POST',
            body: formData
        })

        if (uploadResponse.status === 200) {
            this.files.push(new File(...Object.values(await uploadResponse.json())))
            this.jqSuccessModal.modal('show');
        } else {
            // ToDo Show file upload error msg
        }
    }

    async printAllFiles() {
        /* No files to print */
        if (!this.files.length) {
            return
        }

        return await (
            await fetch('/printAll', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                }
            })
        ).json();
    }
}