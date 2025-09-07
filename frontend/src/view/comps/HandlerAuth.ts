import { el } from 'redom'
import { LoginCard } from "../elems/loginCard";
import { RegCard } from '../elems/regCard';
import { HomeCard } from '../elems/homeCard';

export function AuthHandler() {
    const buttonReg = el('button.button__auth#reg-button', 'Регистрация') as HTMLButtonElement
    const buttonLogin = el('button.button__auth#log-button', 'Авторизация') as HTMLButtonElement
    const buttonEnter = el('button.button__auth#submit-button', 'Войти', {type: 'submit', disabled: true}) as HTMLButtonElement

    const initialBtnGroup = el('.auth__btn', [buttonReg, buttonLogin]) as HTMLDivElement

    HomeCard(initialBtnGroup)

        buttonLogin?.addEventListener('click', () => {
            document.querySelector('#auth')?.remove()
            const title = 'Авторизация'
            const btnGroup = el('.auth__btn', [ buttonEnter, buttonReg ]) as HTMLDivElement
            LoginCard(title, btnGroup) 
        })

        buttonReg?.addEventListener('click', () => {
            document.querySelector('#auth')?.remove()
            const title = 'Регистрация'
            const btnGroup = el('.auth__btn', [buttonEnter, buttonLogin ]) as HTMLDivElement
            RegCard(title, btnGroup)
        })     
}
