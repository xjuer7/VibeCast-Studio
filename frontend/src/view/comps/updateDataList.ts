import { el } from "redom";

export function showEmptyText(parent: HTMLElement, child: HTMLElement, notice: string) {
    child.style.display = 'none'
    const text = el('h3.text-none', notice)
    parent.prepend(text)
}

export function removeEmptyText(parent: HTMLElement, child: HTMLElement) {
    const emptyText = parent.querySelector('.text-none')
    if(emptyText) {
        emptyText.remove()
        child.style.display = 'table-header-group'
    }
}
