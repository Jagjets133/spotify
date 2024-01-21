let currentSong = new Audio();
let songs;

let songInfo = document.querySelector('.song-info');
let songTime = document.querySelector('.song-time');

let play = document.getElementById('play');
let next = document.getElementById('next');
let previous = document.getElementById('previous');
let range = document.getElementById('range');



function secToMin(seconds) {
    let min = ("0" + Math.floor(seconds / 60)).substr(-2);
    let sec = ("0" + Math.floor(seconds % 60)).substr(-2);
    let result = min + ":" + sec;
    if(isNaN(seconds) || seconds < 0) {
        return '00:00';
    }
    return result;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}

function playMusic(track, pause=false) {
    currentSong.src = "/songs/" + track;
    if(!pause) {
        currentSong.play();
    }
    songInfo.innerHTML = decodeURI(track).split('.mp3')[0];
    songTime.innerHTML = "00:00 / 00:00";
}




async function main() {

    //* Get the lists of all songs
    songs = await getSongs();
    playMusic(songs[0], true)
    // console.log(songs);

    //* Show all the songs in playlist
    let songUl = document.querySelector(".song-list ul");
    function showSongs() {
        for (const song of songs) {
            songUl.innerHTML = songUl.innerHTML + `<li>
                <i class="fa-solid fa-music"></i>
                <div class="info">
                    <div class="name">${song.replaceAll('%20', ' ').split('.mp3')[0]}</div>
                    <div class="">Song Artist</div>
                </div>
                <i class="fa-solid fa-circle-play"></i>
            </li>`
        }
    };
    showSongs();


    //* Attach an event listener to each song
    let songLi = document.querySelectorAll(".song-list ul li");
    Array.from(songLi).forEach((li) => {
        li.addEventListener('click', (e) => {
            console.log(li.querySelector(".info div").innerHTML);
            playMusic(li.querySelector(".info div").innerHTML.trim() + '.mp3');
            play.classList.replace('fa-circle-play', 'fa-circle-pause');
        })  
    })



    //* Add an event listener to play button
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.classList.replace('fa-circle-play', 'fa-circle-pause');
        } else {
            currentSong.pause();
            play.classList.replace('fa-circle-pause', 'fa-circle-play');
        }
    });
    


    //* Add an event listener to previous button
    previous.addEventListener('click', () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split('/').slice(-1) [0])
        console.log(index);
        if((index-1) >= 0) {
            playMusic(songs[index-1])
        } 
        // else {
        //     playMusic(songs[index])
        // }
        
    });



    //* Add an event listener to next button
    next.addEventListener('click', () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split('/').slice(-1) [0])

        if((index+1) < songs.length) {
            playMusic(songs[index+1])
        } 
        // else {
        //     playMusic(songs[index])
        // }    
    });


    //* Add an event listener to volume button

    range.addEventListener('click', (e) => {
        console.log(e.offsetX); 
    })

    











    //* Event listener for time update
    let circle = document.querySelector('.circle');

    currentSong.addEventListener('timeupdate', (e) => {
        let currTime = secToMin(currentSong.currentTime);
        let duration = secToMin(currentSong.duration);
        songTime.innerHTML = currTime + " / " + duration;
        circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })



    //* Event listener for seek bar
    let seekBar = document.querySelector('.seek-bar');
    seekBar.addEventListener ('click', (e) => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        circle.style.left = percent + '%';
        currentSong.currentTime =  (currentSong.duration * percent) / 100 ;
    })




}
main();




//* Event listener responsive navbar

document.querySelector('.fa-bars').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0%'
})

document.querySelector('.fa-xmark').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-130%'
})
















