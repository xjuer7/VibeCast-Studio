import { FavoriteTrack } from "../../api/Tracks";
import { el, mount } from "redom";
import { handlerBtnFavoriteItem } from "../comps/HandlerList";
import { editDurationTime, handlerPlayer } from "../comps/HandlerPlayer";
import { showEmptyText } from "./updateDataList";

export let originData: FavoriteTrack[] = [];
let startPage:number = 1;
let combinedArr: FavoriteTrack[] = []


const tableBody = document.getElementById('table-body') as HTMLElement;
const headTable = document.querySelector('thead') as HTMLElement
const contentTracks = document.querySelector('.content__tracks') as HTMLElement


export async function showListTracks(data: FavoriteTrack[], favorite:boolean) {
    const windowWidth = window.innerWidth;

    tableBody!.innerHTML = '';
    const paginationEl = document.querySelector('.content__table__pagination') as HTMLElement
    if(paginationEl) paginationEl.remove()

    const initialData = data.slice(0,10);
    await renderTracks(initialData, favorite)
    originData = data;


    const theadDate = document.getElementById('add-date') as HTMLElement
    favorite ? theadDate.style.display = 'table-cell' : theadDate.style.display = 'none'

    if(windowWidth >= 1024) {
        createPaginationList(data, favorite)
    } else {
        combinedArr = combinedArr.concat(initialData)
        window.addEventListener('scroll', (e) => lazyLoad(favorite, combinedArr))
    }
}

function createPaginationList(tracks: FavoriteTrack[], favoriteFlag: boolean) {
    const pagesCount  = getPagesCount(tracks)

    if(pagesCount > 1) {
        const paginationWrapper = el('.content__table__pagination')
        for(let i = 1; i <= pagesCount; i++) {
            const arrowBtn = el('button.content__table__arrow-btn', i)
            paginationWrapper.appendChild(arrowBtn)
        }
        contentTracks.append(paginationWrapper)
        document.querySelector('.content__table__arrow-btn')!.classList.add('active-pagination')
        

        const paginationBtns = document.querySelectorAll('.content__table__arrow-btn') as NodeListOf<HTMLButtonElement>
        paginationBtns.forEach((btn, index) => btn.addEventListener('click', () => {
            const newArr = pagination(index+1, tracks)
            renderTracks(newArr, favoriteFlag)

            const currentActive = document.querySelector('.active-pagination')
            if(currentActive) currentActive.classList.remove('active-pagination')
            btn.classList.add('active-pagination')
        }))
    }
}

export async function renderTracks(tracks: FavoriteTrack[], favoriteFlag: boolean) {
    tableBody!.innerHTML = '';
    headTable.style.display = 'table-header-group'

    const userAuth = localStorage.getItem('user');
    const localInfo = JSON.parse(userAuth!).favorites || []

    if(tracks.length > 0) {
        tracks.forEach(track=> {
        const isActive = favoriteFlag || (localInfo && localInfo.some((favTrack: { id: number }) => favTrack.id === track.id))

        const row =  el('tr.content__table__row', {'data-id': track.id}, [
            el('td.content__table__item.content__table__item--num', track.id),
            el('td.content__table__item', el('.content__table__wrap', [
                el('span.content__table__item--title', track.title), el('span.content__table__item--descr', track.artist)
            ])),
             el(`td.content__table__item.content__table__item--date ${favoriteFlag ? '' : 'hidden'}`, track.addedAt!) ,
            el('td.content__table__item content__table__item--btn-group', [
                el(`button.content__table__button.content__table__button--favorite ${isActive ? 'active' : ''}#${track.id}`),
                el('span.content__table__duration', editDurationTime(track.duration)),
                el(`button.content__table__button.content__table__button--setting`),
                el(`.delete-btn`, 'Трек удален из избранного')
            ])
        ]);
        mount(tableBody, row)
    })
    } else {
        headTable.style.display = 'none';
        showEmptyText(tableBody, headTable, 'Треки по вашему запросу отсутствуют 👀')
    }


    const buttonsFav = document.querySelectorAll('.content__table__button--favorite') as NodeListOf<HTMLButtonElement>
    for (const item of buttonsFav) {
        item.addEventListener('click', async (event) => await handlerBtnFavoriteItem(event))
    }
    
    const tracksOnPage = document.querySelectorAll('.content__table__row') as NodeListOf<HTMLElement>;
    tracksOnPage.forEach((item) => {
        item.addEventListener('click', () => {
            handlerPlayer(originData, +item.dataset.id!);
        });
    });
}

function pagination(currentPage: number, arr: Array<FavoriteTrack>) {
    const itemsPerPage = 10;
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const newArr = arr.slice(firstIndex, lastIndex)

    return newArr
}

function getPagesCount(arr: Array<FavoriteTrack>) {
    const itemsPerPage = 10;
    const remainder = arr.length % itemsPerPage;
    const pagesCount = remainder === 0 ?  Math.floor(arr.length / itemsPerPage) : (arr.length / itemsPerPage + 1);
    return pagesCount
}


function lazyLoad(favorite: boolean, arr: FavoriteTrack[]) {
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight

    //коэф близости к нижней границе
    const threshold = 0.9

    const lowHeight = scrollY + innerHeight;
    const total = totalHeight * threshold
    const totalPage = getPagesCount(originData)

    if(lowHeight >= total && startPage <= totalPage) {
        startPage++
        loadMoreItems(startPage, favorite, arr);
    }
    return startPage
}

function loadMoreItems(newPage: number, favorite:boolean, arr: FavoriteTrack[]) {
    const newArr = pagination(newPage, originData);
    if (newArr.length > 0) {
        // Добавляем новые элементы к существующим
        combinedArr = arr.concat(newArr);
        renderTracks(combinedArr, favorite);
    }
}

