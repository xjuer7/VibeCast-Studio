
import { el } from "redom"
import { Account } from "../comps/account";
import { handlerTracksInp } from "../comps/HandlerAside";

const table = document.querySelector('.content__main') as HTMLDivElement

export const AccountCard = (username: string) => {
    const contentTracks = document.querySelector('.content__tracks') as HTMLDivElement
    const filterInput = document.querySelector('.header__label') as HTMLLabelElement
    const headerContainer = document.querySelector('.header-container')

    const previousAccount = document.querySelector('.content__account')
    if(previousAccount) previousAccount.remove()
    
    table.style.backgroundColor = 'white'
    contentTracks.style.display = 'none'
    filterInput.style.display = 'none'

    const asideBtn = document.querySelector('.radio-active');
    asideBtn?.classList.remove('radio-active')

    Account(username)

    if(document.querySelector(".account-btn-return")) document.querySelector(".account-btn-return")?.remove()

    const btnReturn = el('button.account-btn-return', 'Вернуться к списку треков')
    headerContainer?.prepend(btnReturn)

    btnReturn.addEventListener('click', async () => {
        handlerTracksInp()
        removeAccountSettings()
    })
}

export function removeAccountSettings() {
    const contentTracks = document.querySelector('.content__tracks') as HTMLDivElement
    const filterInput = document.querySelector('.header__label') as HTMLLabelElement
    const btnReturn = document.querySelector('.account-btn-return')

    contentTracks.style.display = 'block'
    document.querySelector('.content__account')?.remove()
    filterInput.style.display = 'flex'
    btnReturn?.remove()
    table.style.backgroundColor = 'initial'
}

