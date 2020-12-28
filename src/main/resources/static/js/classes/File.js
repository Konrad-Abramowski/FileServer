export default class File {
    selfElement;

    constructor(id, name, url, type, size) {
        this.id = id
        this.name = name
        this.size = size
        this.type = type
        this.url = url

        this.appendSelfToDom()
    }

    appendSelfToDom() {
        const templateElementClass = 'file-list__item--template'
        const filesListElement = document.querySelector('#fileList')
        const templateItemElement = filesListElement.querySelector('.' + templateElementClass).cloneNode(true)

        templateItemElement.classList.remove(templateElementClass)

        /* Fill with data */
        this.selfElement = templateItemElement.cloneNode(true)
        const deleteBtnElement = this.selfElement.querySelector('.file-item__delete-btn')

        deleteBtnElement.id = this.id;

        this.selfElement.querySelector('.file-item__title').textContent = this.name;
        this.selfElement.querySelector('.file-item__subtitle').textContent = this.type;
        this.selfElement.querySelector('.file-item__download').href = this.url;

        filesListElement.appendChild(this.selfElement);

        deleteBtnElement.addEventListener("click", this.delete.bind(this));
    }

    async delete () {
        const deleteResponse = await fetch('/files/' + this.id, {
            'method': 'DELETE',
            'headers': {
                'Content-Type': 'application/json'
            }
        })

        if (deleteResponse.status === 200) {
            this.selfElement.remove()
            // ToDo show successful delete msg
        } else {
            // ToDo show delete error msg
        }
    }
}