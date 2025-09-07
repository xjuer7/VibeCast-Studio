import { AccountCard } from "../elems/accountCard";
import { AuthHandler } from "./HandlerAuth";
import { el } from "redom";
import { handlerFavoriteInp, handlerTracksInp } from "./HandlerAside";
import { navigate } from "./navigate";

export async function checkAuth() {
    const userAuth = localStorage.getItem('user');

    if(userAuth) {
        //настройка приложения
        document.getElementById('app-main')!.style.display = 'block';

        const localInfo = JSON.parse(userAuth!)
        const name = localInfo.username
        
        const username = document.querySelector('.header__user-name')
        username!.textContent = name

        const avatar = localInfo.avatarUrl
        if(avatar) {
            const headerButton = document.querySelector('#header-account') as HTMLButtonElement
            const avatarDefault = document.querySelector('.header__user-none');

            const newAvatar = el('img.header__user-img') as HTMLImageElement
            newAvatar.src = avatar
            avatarDefault?.remove()
            headerButton?.prepend(newAvatar)
        }

        const accountBtn = document.getElementById('header-account') as HTMLButtonElement;  
        const favoriteBtn = document.getElementById('inp-favorite') as HTMLInputElement
        const tracksBtn = document.getElementById('inp-tracks') as HTMLInputElement
        
        if(document.querySelector('.radio-active')) document.querySelector('radio-active')?.classList.remove('radio-active')

        navigate(tracksBtn.value)

        accountBtn.addEventListener('click', () => AccountCard(name))
        favoriteBtn!.addEventListener('click', async () => handlerFavoriteInp())
        tracksBtn!.addEventListener('click', async () => handlerTracksInp())

    } else {
        const app = document.getElementById('app-main') as HTMLDivElement
        app.style.display = 'none';
        AuthHandler()
    }
}