import { Tracks, Track, FavoriteTrack } from '../../api/Tracks';
import { Player } from '../elems/player';
import { addFavorites, deleteFavorites } from '../../api/Tracks';
import { originData } from './showListTrack';

export let timerProgress: NodeJS.Timeout;
export let startPosition: number;
export let shuffledData: Tracks | null;
export let isShuffle:boolean = false;
export let isRepeat:boolean = false;
export let currentShuffledIndex: number = 0;
export let currentOriginIndex: number;

export function editDurationTime(time: number): string {
    const minutes = Math.floor(time);
    const secondsSlice = time % 1;
    const seconds = Math.round(secondsSlice * 60)

    return `${minutes}:${seconds < 10 ? `0` + seconds : seconds}`
}

//таймер для прогрессбара 
export function setTimer(track: Track, valueInp: number = 0) {
    let counter = 0;
    counter = valueInp;

    timerProgress = setInterval(() => {
        counter++;

        if((counter/100) >= track.duration) {
            clearInterval(timerProgress)
            resetPlayerState(track)

            !isRepeat ? nextTrack() : onPause()
            
        } else {
            setValuesOnPlayer(track.duration, counter)
        }
        
    }, 1000)

    return {timerProgress, counter}
}

export function onPause() {
    const playBtn = document.querySelector('.player-btn__play')
    playBtn!.classList.remove('player-btn__pause')
    clearInterval(timerProgress);
}

export function setValuesOnPlayer(timeEnd: number, value: number) {
    const durationStart = document.querySelector('.player-controls__time-from') as HTMLSpanElement
    const durationEnd = document.querySelector('.player-controls__time-to') as HTMLSpanElement
    const trackProgress = document.querySelector('.player-controls__progress-music-top') as HTMLDivElement

    durationStart.textContent = `${editDurationTime(value /100)}`
    durationEnd.textContent = `${editDurationTime(timeEnd - (value / 100))}`
    trackProgress.style.width = `${610 * ((value / 100) / timeEnd)}px`
}

//проверка массива, выбор трека и отрисовка элемента плейлист
export const onClickListTrack = (data: Tracks, id: number) => {
    const existingPlayer = document.querySelector('.player') as HTMLDivElement;
    
    if(existingPlayer) { 
        existingPlayer.remove();
        clearInterval(timerProgress)
    }
    let track;

    if(isShuffle) {
        track = data[currentShuffledIndex]
    } else {
        track = id ? data.find(el => el.id === id) : data[currentOriginIndex]
        currentOriginIndex = data.indexOf(track!) 
    }

    const binaryStr = atob(track!.encoded_audio);
    console.log('Данные с сервера по треку:', binaryStr);

    Player(track!)

    if(window.innerWidth < 1024) {
        const tracksWrapper = document.querySelector('.content__tracks') as HTMLDivElement;
        tracksWrapper.style.paddingBottom = '150px'
        console.log(tracksWrapper);
    }

    if(isShuffle) {
        const shuffleBtn = document.querySelector('.player-btn__shuffle');
        shuffleBtn!.classList.add('shuffle')
    }

    return {track}
}

//добавить/убрать в избранное на плеере
export const handlerBtnFavoritePlayer = async (id: number, btn?: HTMLButtonElement) => {
    const userAuth = localStorage.getItem('user');
    const localInfo = JSON.parse(userAuth!)

    const btnFavoritePlayer = document.getElementById('btn-favorite-player') as HTMLButtonElement
    btnFavoritePlayer.classList.toggle('active');

    if(btnFavoritePlayer.classList.contains('active')) {
            await addFavorites(localInfo.token, id)
            if (btn) btn.classList.toggle('active');
        } else {
            await deleteFavorites(localInfo.token, id)
            if (btn) btn.classList.toggle('active');
        } 
}

//отклик на изменение прогрессбара трека
export const onChangeTrack = (event: Event, track: Track) => {
    const target = event.target as HTMLInputElement;
    const value = +target.value;

    const newPosition = track.duration * (value / 100) //начальная точка воспроизведения
    startPosition = Math.floor(newPosition * 100);

    const playBtn = document.querySelector('.player-btn__play')

    if(playBtn!.classList.contains('player-btn__pause')) {
        clearInterval(timerProgress);
        setTimer(track, startPosition)
        
    } else {
        clearInterval(timerProgress);
        playBtn!.classList.remove('player-btn__pause')
        setValuesOnPlayer(track.duration, startPosition)
        
    }

    return startPosition
}
//кнопка изменения громкости
export const onChangeVolume = (event: Event) => {
    const volumeProgress = document.querySelector('.player-controls__progress-volume-top') as HTMLDivElement
    const circleProgress = document.querySelector('.player-controls__progress-volume-circle') as HTMLDivElement

    const target = event.target as HTMLInputElement;
    const value = +target.value;
    volumeProgress.style.width = `${72 * (value / 100)}px`
    circleProgress.style.transform = `translate(${(72 * (value / 100)) + 20}px, 0px)`
}

//кнопка Play/Pause - если пауза, уточняем место остановки 
export const onPlay = (track: Track) => {
    const playBtn = document.querySelector('.player-btn__play')
    const durationStart = document.querySelector('.player-controls__time-from') as HTMLSpanElement

    if(playBtn!.classList.contains('player-btn__pause')) {
            onPause()  
    } else {
        playBtn!.classList.add('player-btn__pause')
        durationStart.textContent === '0:00' ? setTimer(track) : setTimer(track, startPosition)
    }
}

//функция перемешивания
export const shuffleArray = (array: Tracks) => {
    let shuffledArr = [...array];
    for(let i = shuffledArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]]
    }
    return shuffledArr
}

//установка флага isShuffle, индекса воспроизведения, отрисовка плеера
export const onShuffle = (data: Tracks) => {
    if(!isShuffle) {
        isShuffle = true;
        shuffledData = shuffleArray([...data]);
        currentShuffledIndex = 0
        const firstTrackId = shuffledData[currentShuffledIndex].id
        handlerPlayer(shuffledData, firstTrackId)
    } else {
        isShuffle = false;
        const currentTrack = shuffledData![currentShuffledIndex]
        currentOriginIndex = originData.indexOf(currentTrack)
        const originTrackId = originData[currentOriginIndex].id
        handlerPlayer(originData, originTrackId)
    }
}

//по массиву ищет следующий индекс элемента и рисует новый плеер 
export const nextTrack = () => {
    const sourceData = isShuffle ? shuffledData : originData;
    let nextIndex: number;

    //круговое движение
    if(isShuffle) {
        nextIndex = (currentShuffledIndex + 1) % sourceData!.length
        currentShuffledIndex = nextIndex
    } else {
        nextIndex = (currentOriginIndex + 1) % sourceData!.length
        currentOriginIndex = nextIndex;
    }

    const nextTrack = sourceData![nextIndex];
    handlerPlayer(sourceData!, nextTrack.id)
}
//по массиву ищет предыдущий индекс элемента и рисует новый плеер 
export const prevTrack = (data:Tracks) => {
    const sourceData = isShuffle ? shuffledData! : data;
    let prevIndex: number;

    //круговое движение
    if(isShuffle) {
        prevIndex = (currentShuffledIndex - 1 + sourceData.length) % sourceData!.length
        currentShuffledIndex = prevIndex
    } else {
        prevIndex = (currentOriginIndex - 1 + sourceData.length) % sourceData!.length
        currentOriginIndex = prevIndex;
    }

    const prevItem = sourceData![prevIndex]
    handlerPlayer(sourceData!, prevItem.id)
}

export const onRepeat = (track: Track) => {
    isRepeat = true
    const repeatBtn = document.querySelector('.player-btn__repeat');
    repeatBtn!.classList.add('repeat')
}

export function resetPlayerState(track: Track) {
    const trackProgress = document.querySelector('.player-controls__progress-music-top') as HTMLDivElement
    const volumeProgress = document.querySelector('.player-controls__progress-volume-top') as HTMLDivElement
    const circleProgress = document.querySelector('.player-controls__progress-volume-circle') as HTMLDivElement

    trackProgress.style.width = `0px`
    volumeProgress.style.width = `30px`
    circleProgress.style.transform = `translate(50px, 0px)`

    const durationStart = document.querySelector('.player-controls__time-from') as HTMLSpanElement
    const durationEnd = document.querySelector('.player-controls__time-to') as HTMLSpanElement

    durationStart!.textContent = '0:00';
    durationEnd!.textContent = `${editDurationTime(track!.duration)}`
}

//отрисовка плеера в зависимости от массива и id + обработчики
export const handlerPlayer = (data: Tracks, id: number) => {
    const { track } = onClickListTrack(data, id)
    resetPlayerState(track!)

    const btnFavoritePlayer = document.getElementById('btn-favorite-player') as HTMLButtonElement
    const trackProgressInp = document.querySelector('.player-controls__progress-inp') as HTMLInputElement
    const volumeProgressInp = document.querySelector('.player-controls__progress-inp-volume') as HTMLInputElement

    const shuffleBtn = document.querySelector('.player-btn__shuffle');
    const prevBtn = document.querySelector('.player-btn__prev')
    const playBtn = document.querySelector('.player-btn__play')
    const nextBtn = document.querySelector('.player-btn__next')
    const repeatBtn = document.querySelector('.player-btn__repeat')

    const btnFavoriteListOnScreen = document.querySelectorAll('.content__table__button--favorite') as NodeListOf<HTMLButtonElement>
    let foundItem = [...btnFavoriteListOnScreen].find((el) => +el.id === track!.id) as HTMLButtonElement

    if(foundItem) {
        //на отображаемой странице
        btnFavoritePlayer.addEventListener('click', async () => handlerBtnFavoritePlayer(track!.id, foundItem))
        if(foundItem.classList.contains('active')) btnFavoritePlayer.classList.add('active')
    } else {
        btnFavoritePlayer.addEventListener('click', async () => handlerBtnFavoritePlayer(track!.id))
    } 

    trackProgressInp!.addEventListener('change', (event) => onChangeTrack(event, track!))
    volumeProgressInp!.addEventListener('change', (event) => onChangeVolume(event))
    playBtn?.addEventListener('click', () => onPlay(track!))
    nextBtn?.addEventListener('click', () => nextTrack())
    prevBtn?.addEventListener('click', () => prevTrack(data))
    shuffleBtn?.addEventListener('click', () => onShuffle(data))
    repeatBtn?.addEventListener('click', () => onRepeat(track!))
}



