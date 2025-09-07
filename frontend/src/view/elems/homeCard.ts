import {el, mount} from 'redom'

export function HomeCard( btnGroup: HTMLDivElement) {
    const titleModal = el('h2.auth__title', `На связи студия подкаста VibeCastStudio 👋🏻`) as HTMLTitleElement
    const descrModal = el('p.auth__notice', 'Слушайте подкасты резидентов студии в аудиоплеере с возможностью формировать свои полки и сохранять в «Избранное» любимые записи 🧡 ') as HTMLParagraphElement
    const textModal = el('p.auth__notice', `Уже есть аккаунт?`) as HTMLParagraphElement

    const previewModal = el('#auth', [titleModal, descrModal, textModal, btnGroup])

    mount(document.body, previewModal)
}