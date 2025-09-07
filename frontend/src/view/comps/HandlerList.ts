
import { addFavorites, deleteFavorites } from '../../api/Tracks';

export const handlerBtnFavoriteItem = async (event: Event) => {
    event.stopPropagation()

    let noticeTimer: NodeJS.Timeout;
    const target = event.target as HTMLButtonElement

    const userAuth = localStorage.getItem('user');
    const localInfo = JSON.parse(userAuth!)

    const btnGroup = target.parentElement;
    const deleteNotice = btnGroup!.querySelector('.delete-btn') as HTMLDivElement

    const player = document.querySelector('.player') as HTMLDivElement
    const btnFavoritePlayer = document.getElementById('btn-favorite-player') as HTMLButtonElement

    if(target.classList.contains('active')) {
        //удаление
        deleteNotice.style.display = 'block'
        noticeTimer = setTimeout(() => {
            deleteNotice.style.display = 'none'
            clearTimeout(noticeTimer)
        }, 900);
        
        target.classList.toggle('active')
        
        await deleteFavorites(localInfo.token, +target.id)
        if(player && target.id === btnFavoritePlayer.dataset.id) btnFavoritePlayer.classList.toggle('active')


    } else {
        //добавление
        target.classList.toggle('active')
        if(player && target.id === btnFavoritePlayer.dataset.id) btnFavoritePlayer.classList.toggle('active')  
        await addFavorites(localInfo.token, +target.id)
    
    }
}

