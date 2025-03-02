// Import Firebase modules from the same version
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8Jo4GfLDgIA6jlQ8DqNYY-x7Jkzi_1Ok",
    authDomain: "debaspotifyclone.firebaseapp.com",
    projectId: "debaspotifyclone",
    storageBucket: "debaspotifyclone.appspot.com",
    messagingSenderId: "845893822646",
    appId: "1:845893822646:web:7f38db2243000f26c61e17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the auth service
const auth = getAuth(app);

// Select buttons from the DOM
const signUpLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const logoutBtn = document.getElementById('logout-btn');

let isUserLoggedIn = false;  // A flag to check login state
let songPlayCount = 0;       // Count the number of songs played for non-logged-in users


// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        isUserLoggedIn = true;  // User is logged in
        signUpLink.style.display = 'none';
        loginLink.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        isUserLoggedIn = false;  // No user is logged in
        signUpLink.style.display = 'block';
        loginLink.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
});


// Log out functionality
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'signIn.html'; // Redirect to login page after logout
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});


// Function to redirect to login page after 5 seconds if not logged in
// function redirectIfNotLoggedIn() {
//     onAuthStateChanged(auth, (user) => {
//         if (!user) {

//             console.log("User not logged in. Redirecting to login page in 5 seconds...");
//             setTimeout(function () {
//                 window.location.href = '/signIn.html';
//             }, 8000);
//         } else {
//             console.log("User is logged in:", user);

//         }
//     });
// }

// Call the function when the page loads
// redirectIfNotLoggedIn();



let currentSong = new Audio();
let songs;
let currfolder;
let currentSongIndex = 0;

//seconds to minutes : second format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


//song list in left
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        
                        <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="song">${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
                                <div>ZAHID</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="img/play.svg" alt="">
                            </div>
                    </li> `;
    }

    // attach an event listener to each song in the libary section
    let array = Array.from(document.querySelector(".songList").getElementsByTagName("li"))
    array.forEach((e, index) => {

        e.addEventListener("click", (element) => {
            if (currentSongIndex !== null) {
                // Reset the previously playing song
                let previousSong = array[currentSongIndex];
                previousSong.querySelector(".playnow").firstElementChild.innerHTML = "Play Now";
                previousSong.querySelector(".playnow").lastElementChild.src = "img/play.svg";
                // console.log(previousSong)

                previousSong.querySelector(".playnow").firstElementChild.style.cssText = "color: white; font-weight: normal ;letter-spacing:0;";
            }
            // e.querySelector(".info").firstElementChild.style.transition="none"

            currentSongIndex = index;
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);

            // Update the UI for the currently playing song

            e.querySelector(".playnow").firstElementChild.innerHTML = "Playing";
            e.querySelector(".playnow").lastElementChild.src = "img/pause.svg";

            e.querySelector(".playnow").firstElementChild.style.cssText = "color: #fd2955; font-weight: bold ;letter-spacing: .8px;";
        })
    })
    return songs;
}


const playMusic = (track, pause = false) => {

    track += ".mp3"
    currentSong.src = `/${currfolder}/` + track;

    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    // document.querySelector(".playnow").innerHTML ="Playing"
    document.querySelector(".songinfo").innerHTML = decodeURI(track.replaceAll(".mp3", ""));
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


    if (!isUserLoggedIn && songPlayCount >= 1) {
        alert("Please log in to continue listening.");
        window.location.href = '/signIn.html';
        return;
    }

}

// Update the song list button state
function updateButtonState() {
    let songItems = Array.from(document.querySelector(".songList").getElementsByTagName("li"));

    songItems.forEach((songItem, index) => {
        let playNowButton = songItem.querySelector(".playnow");
        let playText = playNowButton.firstElementChild;
        let playIcon = playNowButton.lastElementChild;


        if (index === currentSongIndex) {
            // Current song - check if it's playing or paused
            if (currentSong.paused) {
                // If paused, show "Play Now"
                playText.innerHTML = "Play Now";
                playText.style.cssText = "color: white; font-weight: normal; letter-spacing: 0;";
                playIcon.src = "img/play.svg";
            } else {
                // If playing, show "Playing"
                playText.innerHTML = "Playing";
                playText.style.cssText = "color: #fd2955; font-weight: bold; letter-spacing: .8px;";
                playIcon.src = "img/pause.svg";
            }
        } else {
            // Other songs - not playing
            playText.innerHTML = "Play Now";
            playText.style.cssText = "color: white; font-weight: normal; letter-spacing: 0;";
            playIcon.src = "img/play.svg";
        }
    });
}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(4)[0];

            //get the meta data of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div  data-folder="${folder}" class="card rounded">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"
                    fill="none">
                    <circle cx="50" cy="50" r="25" fill="#fc4d70" />
                    <g transform="translate(39, 38)">
                        <path d="M5 20V4L19 12L5 20Z" fill="#0a183d" />
                    </g>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {


        e.addEventListener("click", async item => {

            // console.log(item);
            currentSongIndex = 0;
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[currentSongIndex].replace(".mp3", ""));
            updateButtonState();  // Update button state after song is loaded



        })
    })
}

async function main() {
    // get the list of all the songs
    await getSongs("songs/Bengali");

    playMusic(songs[currentSongIndex].replace(".mp3", ""), true);

    //Display all the albums on the page
    displayAlbums()



    //next song play automatically
    currentSong.addEventListener("ended", () => {
        currentSongIndex++;
        if (currentSongIndex < songs.length) {
            playMusic(songs[currentSongIndex].replace(".mp3", ""));
        }

        if (!isUserLoggedIn) {
            songPlayCount++;
            alert("Please log in to continue listening.");
            if (songPlayCount >= 1) {
                // After one song is completed, redirect to login page if not logged in
                
                console.log("Redirecting to login page...");
                window.location.href = '/signIn.html';
            }
        }


    });

    // Attach an event listener to play
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"

        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"

        }
    })



    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        const value = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".seekbar").style.background = `linear-gradient(to right, #fff 0%, #fff ${value}%, #ffa4b6 ${value}%, #ffa4b6 100%)`
    })


    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //Add an eventlistner to hamburger
    document.querySelector(".hamberger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an eventlistner for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //search option appear
    document.querySelector(".search-icon").addEventListener("click", () => {
        if (document.querySelector(".search-form").style.display === "none" || document.querySelector(".search-form").style.display === "") {

            document.querySelector(".search-form").style.display = "flex";
            document.querySelector(".left").style.left = "-120%"
        } else {
            document.querySelector(".search-form").style.display = "none";
        }
    })

    document.querySelector(".search-form").addEventListener("click", () => {
        document.querySelector(".search-form").style.cssText = `
            display: flex;
            border: 1px solid white;
        `;
    })

    // add an eventlistner for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;

        if (e.target.value == 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg");
        }
        else {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    })

    //Add eventlistner to mute the volume
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            document.querySelector('.progress').style.background = `linear-gradient(to right, #ff9aae 0%, #ff9aae 0%, #fff 0%, #fff 100%)`;
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = .15;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 15;
            document.querySelector('.progress').style.background = `linear-gradient(to right, #ffb1c1 0%, #ffb1c1 15%, #fff 0%, #fff 100%)`;
        }
    })

    // Add event listner to volume update
    const progress = document.querySelector('.progress');
    progress.addEventListener('input', function () {
        const value = this.value;
        this.style.background = `linear-gradient(to right, #ff9aae 0%, #ff9aae ${value}%, #fff ${value}%, #fff 100%)`
    })

    // change the play Now to playing and play.svg to pause.svg
    let array = Array.from(document.querySelector(".songList").getElementsByTagName("li"))

    // Handle play/pause toggle
    currentSong.addEventListener("play", () => {
        play.src = "img/pause.svg";
        updateButtonState();
    });

    currentSong.addEventListener("pause", () => {
        play.src = "img/play.svg";

        updateButtonState();
    });


    // Handle previous song
    previous.addEventListener("click", () => {
        currentSong.pause();
        play.src = "img/play.svg";

        if ((currentSongIndex - 1) >= 0) {
            currentSongIndex--;  // Decrease the index
            playMusic(songs[currentSongIndex].replace(".mp3", ""));
        } else {
            play.src = "img/play.svg";  // If no previous song, just reset play button
        }

        updateButtonState();  // Update song list button state after switching song
    });

    //add an eventlistner to  next
    next.addEventListener("click", () => {
        currentSong.pause();
        play.src = "img/play.svg";

        if ((currentSongIndex + 1) < songs.length) {
            currentSongIndex++;  // Increase the index
            playMusic(songs[currentSongIndex].replace(".mp3", ""));
        } else {
            play.src = "img/play.svg";  // If no next song, just reset play button
        }

        updateButtonState();  // Update song list button state after switching song
    });






}
main()
