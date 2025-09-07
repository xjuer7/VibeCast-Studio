

export async function navigate(cardName: string) {
    const userAuth = localStorage.getItem('user');
    const userToken = JSON.parse(userAuth!).token!
    
    const player = document.querySelector('.player') as HTMLDivElement
    if (player) player.remove();

    switch(cardName) {
        case 'favorite':
            const favoriteCard = await import('../elems/favoriteTracksCard');
            favoriteCard.default(userToken)
            break;
        default:
            const tracksCard = await import('../elems/allTracksCard'); 
            tracksCard.default(userToken)

            const tracksBtn = document.getElementById('inp-tracks') as HTMLInputElement
            const labelTracks = tracksBtn.parentElement as HTMLInputElement
            labelTracks.classList.add('radio-active')
    }
}