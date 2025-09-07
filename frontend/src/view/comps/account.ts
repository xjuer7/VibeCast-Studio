import { el } from "redom"
import { checkAuth } from "./checkAuth";

export const Account = (username: string) => {
    const storage = localStorage.getItem('user')!;
    const storageInfo = JSON.parse(storage);

    const table = document.querySelector('.content__main') as HTMLDivElement
    const headerButton = document.querySelector('#header-account') as HTMLButtonElement 

    const title = el('h2.account-title', 'Личный кабинет')
    const loginPerson = el('h3.account-login', `Ваш логин: ${username}`)
    const btnAvatar = el('button.account-btn')
    const avatarDefault = document.querySelector('.header__user-none');

    const input = el('input#inp_image.account_inp', {type: 'file', accept: "image/*"}) as HTMLInputElement
    const image = el('img#image.account_image') as HTMLImageElement

    const inputWrapper = el('.account-select', [btnAvatar, input])
    const btnExit = el('button.account-btn.account-btn__exit', 'Выйти из приложения')
    const accountWrapper = el('.content__account', [ title, el('.account', [inputWrapper, loginPerson, btnExit]) ])
    
    table.firstElementChild?.appendChild(accountWrapper)

    if(avatarDefault) btnAvatar.textContent = 'Добавить аватар'

    if(storageInfo.avatarUrl) {
        image.src = storageInfo.avatarUrl;
        document.querySelector('.account')!.prepend(image)
        btnAvatar.textContent = 'Обновить аватар'
    }

    input.addEventListener('change', async() => {
        if(input.files && input.files.length > 0) {
            const file = input.files[0];
            const path = URL.createObjectURL(file)

            const compressedImage = await resizeImg(path)

            image.src = compressedImage;
            document.querySelector('.account')!.prepend(image)

            const updatedUser = {...JSON.parse(storage), avatarUrl: compressedImage}
            localStorage.setItem('user', JSON.stringify(updatedUser))

            const newHeaderIcon = el('img.header__user-img') as HTMLImageElement
            newHeaderIcon.src = image.src
            avatarDefault?.remove()
            btnAvatar.textContent = 'Обновить аватар'

            const headerAccountIcon = headerButton.querySelector('.header__user-img')
            if(headerAccountIcon) headerAccountIcon.remove()
            headerButton?.prepend(newHeaderIcon)
        }
    })

    btnExit.addEventListener('click', () => {
        localStorage.removeItem('user');
        checkAuth()
    })
}

async function resizeImg(path: string): Promise<string> {
    const img = new Image();
    img.src = path;

    await new Promise(resolve => img.onload = resolve);
    const newWidth = img.naturalWidth * 0.3;
    const newHeight = img.naturalHeight * 0.3;

    const canvas = document.createElement('canvas')
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, newWidth, newHeight);
   
    const compressedImage = canvas.toDataURL('image/jpeg', 0.3)
    
    URL.revokeObjectURL(path)
    return compressedImage
}
