var videoUrls = [
    "Openings_and_Endings/ED1 - STYX HELIX nocut.mp4",
    "Openings_and_Endings/OP1 - Redo.mp4",
    "Openings_and_Endings/ED1 - STYX HELIX.mp4",
    "Insert_Songs/STRAIGHT BET.mp4",
    "Openings_and_Endings/ED1 - STYX HELIX slow.mp4",
    "Insert_Songs/Memories.mp4",
    "Insert_Songs/White White Snow.mp4",
    "Openings_and_Endings/OP2 - Paradisus - Paradoxum.mp4",
    "Openings_and_Endings/ED2 - Stay Alive.mp4",
    "Insert_Songs/Theater D.mp4",
    "Insert_Songs/Wishing.mp4",
    "Openings_and_Endings/S1 Ending.mp4",
    "Openings_and_Endings/OP3 - Realize.mp4",
    "Openings_and_Endings/ED3 - Memento.mp4",
    "Insert_Songs/Yuki no hate ni Kimi no na wo.mp4",
    "Insert_Songs/Door.mp4",
    "Openings_and_Endings/OP4 - Long shot.mp4",
    "Openings_and_Endings/ED4 - Believe in you.mp4",
    "Insert_Songs/What you don't know.mp4",
    "Openings_and_Endings/S2 Ending.mp4",
    "Openings_and_Endings/OP5 - Reweave.mp4",
    "Openings_and_Endings/ED5 - NOX LUX.mp4",
    "Insert_Songs/I Trust You.mp4",
];
let isPosterSet = false; //Track if poster is set
let currentIndex = 0; // For videoUrls
let newcurrentIndex = 0; // For newvideoUrls
let isSwitching = false;
let clickCount = 0;
let preloadedVideos = [];
let disablePreloading = false;
let nextVideoTimeout;
let loopcurrentIndex = 0;
let loopclickCount = 0;
let enableLoopingListener = null;
let delay = 0;
let isAnimating = false;
let intervalId;
let isIntervalActive = true;
let FclickCount = 0;
let nextClickCount = 0;
let originalIndex = 0;
let keyB = 0
let Fullscreen = null;

function playVideo(videoName) {
    nextVideo.src = '';
    // Extract the file name from the full path
    const songName = videoName.split('/').pop(); // Get the last part of the path after splitting by '/'
    // Update the video player screen with the selected video
    // For example, you can set the video source and play the video
    document.getElementById('videoPlayer').src = videoName;
    document.getElementById('videoPlayer').play();
    console.log('Video selected:',songName)
    // Update the currentIndex and newcurrentIndex based on the selected video
    currentIndex = videoUrls.indexOf(videoName);
    if (!isPosterSet) {
        videoPlayer.poster = "Other_Files/black.png";
        isPosterSet = true;
    }
    // Clear the timeout for playNextVideo
    clearTimeout(nextVideoTimeout); 
    // When playVideo is executed, reset isSwitching.
    isSwitching = false; 
    simulateClick();
}
const videoPlayer = document.getElementById('videoPlayer');
videoPlayer.addEventListener('play',function(){
    clearTimeout(nextVideoTimeout);
    isSwitching = false;
    if (!isPosterSet) {
        videoPlayer.poster = "Other_Files/black.png";
        isPosterSet = true;
    }
    var name = ''
    var artist = ''
    let musicArtwork = ''
    const songName = videoPlayer.src.split('/').pop(); // Get the last part of the path after splitting by '/'
    if (songName == "S1%20Ending.mp4"){
        name = 'Season 1 Ending'
        artist = 'Myth & Roid'
        musicArtwork = {
            src: "Icons/artworks/STYX_HELIX_Cover.webp",
            sizes: "1008x1000",
            type: "image/png",
          }
    }
    else if (songName == "S2%20Ending.mp4"){
        name = 'Season 2 Ending'
        artist = 'Mayu Maeshima'
        musicArtwork = {
            src: "Icons/artworks/Long_Shot_Cover.webp",
            sizes: "997x992",
            type: "image/png",
          }
    }
    else if (songName == "Theater%20D.mp4"){
        name = 'Theater D'
        artist = 'Myth & Roid'
        musicArtwork = {
            src: "Icons/artworks/Theater_D_Cover.jpg",
            sizes: "1080x1080",
            type: "image/png",
          }
    }
    else if (songName == 'ED1%20-%20STYX%20HELIX%20slow.mp4') {
        name = 'STYX HELIX (slow ver.)'
        artist = 'Mayu Maeshima'
        musicArtwork = {
            src: "Icons/artworks/STYX_HELIX_Cover.webp",
            sizes: "997x992",
            type: "image/png",
          }
    }
    else {
        const songName = videoUrls[currentIndex].split('/').pop();
        const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
        if (songName[0] == 'E' || songName[0] == "O")
            name = songName.slice (6, lastDot)
        else 
            name = songName.slice(0, lastDot)
    }
    if (name == 'STYX HELIX' || name == 'Paradisus - Paradoxum' || name == 'NOX LUX' ||name == 'STRAIGHT BET'){
        artist = 'Myth & Roid'
        if (name == 'STYX HELIX')
            musicArtwork = {
                src: "Icons/artworks/STYX_HELIX_Cover.webp",
                sizes: "1008x1000",
                type: "image/png",
              }
        else if (name == 'Paradisus - Paradoxum')
            musicArtwork = {
                src: "Icons/artworks/Paradisus-Paradoxum_Cover.webp",
                sizes: "1000x993",
                type: "image/png",
              }
        else if (name == 'NOX LUX')
            musicArtwork = {
                src: "Icons/artworks/NOX_LOX_Cover.webp",
                sizes: "1080x1080",
                type: "image/png",
              }
        else if (name == 'STRAIGHT BET')
            musicArtwork = {
                src: "Icons/artworks/STRAIGHT_BET_Cover.jpg",
                sizes: "721x720",
                type: "image/png",
              }
        }
    else if (name == 'STYX HELIX nocut') {
        name = 'STYX HELIX'
        artist = 'Myth & Roid'
        musicArtwork = {
            src: "Icons/artworks/STYX_HELIX_Cover.webp",
            sizes: "997x992",
            type: "image/png",
          }
    }
    else if (name == 'Long shot'){
        artist = 'Mayu Maeshima'
        musicArtwork = {
            src: "Icons/artworks/Long_Shot_Cover.webp",
            sizes: "1400x1400",
            type: "image/png",
          }
    }
    else if (name == 'Redo' || name == 'Realize' || name == 'Reweave'){
        artist = 'Konomi Suzuki'
        if (name == 'Redo')
            musicArtwork = {
                src: "Icons/artworks/Redo_Cover.webp",
                sizes: "997x992",
                type: "image/png",
            }
        else if (name == 'Realize')
            musicArtwork = {
                src: "Icons/artworks/Realize_cover.webp",
                sizes: "500x500",
                type: "image/png",
            }
        else if (name == 'Reweave')
            musicArtwork = {
                src: "Icons/artworks/Reweave_Cover.webp",
                sizes: "1600x1600",
                type: "image/png",
            }
        }
    else if (name == 'Stay Alive' || name == 'Door' || name == 'I Trust You'){
        artist = 'Emilia (CV: 高橋李依)'
        if (name == 'Stay Alive')
            musicArtwork = {
                src: "Icons/artworks/Stay_Alive_Cover.webp",
                sizes: "1280x1281",
                type: "image/png",
            }
        else if (name == 'Door')
            musicArtwork = {
                src: "Icons/artworks/Character_song_album.webp",
                sizes: "1280x1280",
                type: "image/png",
            }
        else if (name == 'I Trust You')
            musicArtwork = {
                src: "Icons/artworks/Character_song_album.webp",
                sizes: "1280x1280",
                type: "image/png",
            }
    }
    else if (name == 'Memento' || name == 'Believe in you' || name == 'Yuki no hate ni Kimi no na wo' || name == 'White White Snow'){
        artist = 'nonoc'
        if (name == 'Memento')
            musicArtwork = {
                src: "Icons/artworks/Memento_cover.webp",
                sizes: "500x500",
                type: "image/png",
            }
        else if (name == 'Believe in you')
            musicArtwork = {
                src: "Icons/artworks/Believe_in_you_cover.webp",
                sizes: "500x500",
                type: "image/png",
            }
        else if (name == 'Yuki no hate ni Kimi no na wo')
            musicArtwork = {
                src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
                sizes: "640x640",
                type: "image/png",
            }
        else if (name == 'White White Snow')
            musicArtwork = {
                src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
                sizes: "640x640",
                type: "image/png",
            }
    }
    else if (name == 'Memories'){
        artist = 'Azuna Riko'
        musicArtwork = {
            src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
            sizes: "640x640",
            type: "image/png",
        }
    }
    else if (name == 'Wishing'){
        artist = 'Rem (CV: Inori Minase)'
        musicArtwork = {
            src: "Icons/artworks/Character_song_album.webp",
            sizes: "1280x1280",
            type: "image/png",
        }
    }
    else if (name == 'What you don\'t know'){
        artist = 'Ram (CV: Rie Murakawa)'
        musicArtwork = {
            src: "Icons/artworks/Character_song_album.webp",
            sizes: "1280x1280",
            type: "image/png",
        }
    }

    navigator.mediaSession.metadata = new MediaMetadata({
        title: name,//the title of the media
        artist: artist,//the artist of the media
        artwork: 
        [
            musicArtwork
        ]
      });
    document.title = "「" + name + "」";
    navigator.mediaSession.setActionHandler("previoustrack", () => {
        previousVideoTrack()
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        nextVideoTrack()
      });
})
// Automatically play next video after ending with a delay
function playNextVideo() {
    if (!isSwitching) {
        isSwitching = true;
        // Delay before switching to the next video
        nextVideoTimeout = setTimeout(function() {
            currentIndex = (currentIndex + 1) % videoUrls.length;
            videoPlayer.src = videoUrls[currentIndex];
            videoPlayer.poster = "Other_Files/black.png"; // Clear the poster attribute
            videoPlayer.play();
            isSwitching = false;
        }, delay);     
    }
}

// Add event listener to stop the timeout if playVideo is pressed while setTimeout is running
videoPlayer.addEventListener('play', function() {
    clearTimeout(nextVideoTimeout);
});

const mediaQuery = window.matchMedia('(max-width: 722px)'); // Define a media query for mobile devices
const moveableimg = document.querySelector('.moveable_img');
const textToChange = document.getElementById('text_to_change');
const navbarContent = document.getElementById('oldnavbarContent');
const newnavbarContent = document.getElementById('newnavbarContent');
const bodytext =document.getElementById('bodytext');
const songname =document.getElementById('songname');
const disablePreloadingbutton = document.querySelector('.subaru');
const enablePreloadingbutton = document.querySelector('.trademark');
const nextButton = document.getElementById('nextButton');
const backButton = document.getElementById('backButton');
const nextnavbar = document.getElementById('nextnavbarContent');
const lastnavbar = document.getElementById('lastnavbarContent')
const SidebarButton = document.getElementById('SidebarButton');
const Trademark = document.getElementById('trademark');
const body = document.getElementById('body');

function handleFontSizeChange(mediaQuery) {
    // Change font size for mobile devices
    if (mediaQuery.matches) {
        textToChange.style.fontSize = '4vw';
    }
    // Reset font size for non-mobile devices
    else {
        textToChange.style.fontSize = 'inherit'; 
    }
}

// Initial call to set font size based on device width
handleFontSizeChange(mediaQuery);
// Add event listener for changes in media query
mediaQuery.addEventListener('change', handleFontSizeChange);

const root = document.documentElement;
// Disable preloading when clicking on re:zero cast image
disablePreloadingbutton.addEventListener('click',function(){
    if (!disablePreloading) {
        alert("Preloading disabled!");
        console.log('Preloading disabled!');
        disablePreloading = true;
        // Added failsafe if mistakenly clicked on picture (in IF statements: "!const" = "const === false")
        if (disablePreloading){
            enablePreloadingbutton.addEventListener('click',function(){
                alert("Preloading enabled!");
                console.log('Preloading enabled!');
                disablePreloading = false;
            }, {once :  true});
        }
    }
}, );
const nextVideo = document.createElement('video');
// Video preloading 
videoPlayer.addEventListener('timeupdate', function() {
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;
    if (duration - currentTime <= 5 && !disablePreloading) {

    // Preload multiple videos based on the current video type
        const nextIndex = (currentIndex + 1) % videoUrls.length;
        if (!preloadedVideos.includes(videoUrls[nextIndex])) {
            nextVideo.src = videoUrls[nextIndex];
            nextVideo.preload = 'auto';
            preloadedVideos.push(videoUrls[nextIndex]);
            console.log('Next video preloaded:', videoUrls[nextIndex]);   
        }
    }      
});

function disableFocus(element) {
    element.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
}
disableFocus(videoPlayer);

// Reset preloadedVideos array every 60 seconds (worst case scenario) to optimize playback.
function ResetArray(){
    preloadedVideos = [];
}
videoPlayer.addEventListener('ended',ResetArray)

function cleanVideoSrc(src) {
    const startIndex = src.lastIndexOf("/") - 20; 
    const cleanedPath = src.substring(startIndex);
    return cleanedPath.replace(/%20/g, ' ');
}


// Enable and Disable Looping functions
enableLoopingListener = function EnableLooping() {
    const currentVideo = cleanVideoSrc(videoPlayer.src)
    if (!videoUrls.includes(currentVideo)){
        clearTimeout(nextVideoTimeout);
    }
    else {
        loopcurrentIndex = currentIndex;
        videoPlayer.src = videoUrls[loopcurrentIndex];
        clearTimeout(nextVideoTimeout);
    }
    videoPlayer.play();
    isSwitching = false;
};
const loopVideo = document.querySelector('#loop')
const loopText = document.querySelector('.looptext')
loopVideo.addEventListener('click',function() {
    loopclickCount++
    if (loopclickCount % 2 == 1){
        loopText.innerHTML = "Disable looping";
        videoPlayer.removeEventListener('ended',ResetArray);
        videoPlayer.addEventListener('ended', enableLoopingListener);
        const songName = videoUrls[currentIndex].split('/').pop();
        const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
        let name = ''
        if (songName[0] == 'E' || songName[0] == "O")
            name = songName.slice (6, lastDot)
        else 
            name = songName.slice(0, lastDot)
        console.log('Video looping enabled for:', songName);
        alert("Video looping enabled for: " + name);   
    }
    else {
        loopText.innerHTML = "Enable looping";
        videoPlayer.removeEventListener('ended', enableLoopingListener);
        videoPlayer.addEventListener('ended',ResetArray);
        const songName = videoUrls[currentIndex].split('/').pop();
        const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
        let name = ''
        if (songName[0] == 'E' || songName[0] == "O")
            name = songName.slice (6, lastDot)
        else 
            name = songName.slice(0, lastDot)
        console.log('Video looping disabled for:', name);
        alert("Video looping disabled for: " + name);   
    }
});

Fullscreen = function(){
    document.documentElement.requestFullscreen();
}

// Check for orientation change using matchMedia (for mobile devices)
const checkOrientation = () => {
    if (window.matchMedia("(max-width: 768px) and (orientation: landscape)").matches) {
        body.addEventListener('click',Fullscreen(),{once :  true})
        body.removeEventListener('click', Fullscreen(),{once : true})
        setTimeout(function(){
            videoPlayer.style.width = "auto";
            videoPlayer.style.height = "100vh";
            videoPlayer.style.margin = "0 auto";
        },700)
    }
    else if (window.matchMedia("(max-width: 768px) and (orientation: portrait").matches) {
        videoPlayer.style.height = "auto";
        videoPlayer.style.marginTop = "6vw"; 
    }
    else if (!TheaterModeFlag){
        videoPlayer.style.height = "46.855vh"
        videoPlayer.style.marginTop = "2vh"
    }
};
// Listen for orientation changes
window.addEventListener("resize", checkOrientation);


// Function to shuffle the array elements randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
return array;
}
// Get a reference to the shuffle button element
const shuffleButton = document.getElementById('randomize');
// Add an event listener to the shuffle button to randomize the order of songs
shuffleButton.addEventListener('click', function() {
// Shuffle the videoUrls array
    videoUrls = shuffleArray(videoUrls);
    playVideo(videoUrls[0]);
    preloadedVideos = [];
    alert("Videos shuffled! (check console logs for more info)");
// You can now use the shuffled videoUrls array for playing the songs in a random order
    console.log('Shuffled videos to:', videoUrls);
});
    
// Update the delay variable
function updateDelay(newDelay) {
    delay = newDelay; 
}
// Add event listener for button click
document.getElementById("Delay").addEventListener("click", function() {
    // Prompt user for new delay
    let newDelay = parseInt(prompt("Enter new delay in milliseconds (Current delay: " + delay + "ms)"));
    // Validate user input
    if (isNaN(newDelay) || newDelay < 0) {
        alert("Invalid delay. Please enter a non-negative number.");
    return;
    }
    if (newDelay > 10000) {
        alert("You really like to sleep when switching videos! (Delay not changed)");
    return;
    }
    // Update delay and optionally display confirmation
    updateDelay(newDelay);
    console.log("Delay updated to", newDelay, "milliseconds");
});

function nextVideoTrack(){
    const nextcurrentIndex = (currentIndex + 1) % videoUrls.length;
    playVideo(videoUrls[nextcurrentIndex]);
}

function previousVideoTrack() {

    if (currentIndex > 0) {
        prevIndex = currentIndex - 1;
        playVideo(videoUrls[prevIndex]);
    }
}
// Register key being pressed
document.addEventListener("keydown", function(event) {
    // Play/pause the video when pressing space
    if (event.code === "Space") {
        if (videoPlayer.paused)
            videoPlayer.play();
        else 
            videoPlayer.pause();
    }
    // Skipping to the next video using the playVideo function when pressing right arrow key
    if (event.code === "ArrowRight") {
        nextVideoTrack()
    }
    // Returning to the previous video using the playVideo function (doesn't work if used on first video)

    if (event.code === "ArrowLeft") {
        previousVideoTrack()
    }
    if (event.code === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior
    }
    if (event.code === 'KeyQ') {
        shuffleButton.click();
    }   
    if (event.code === 'KeyW') {
        loopVideo.click();
    }   
    if (event.code === 'KeyE') {
        document.getElementById("Delay").click();
    }
    if (event.code === 'KeyR') {
        togglePictureInPicture();
    }
    if (event.code === 'KeyF'){
        if ((document.fullscreenElement && document.fullscreenElement === videoPlayer) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement === videoPlayer) ||
            (document.msFullscreenElement && document.msFullscreenElement === videoPlayer)
        ) 
            closeFullscreen(); // Video is currently in fullscreen mode, so close fullscreen
        else 
            openFullscreen();  // Video is not in fullscreen mode, so open fullscreen
    }
    if (event.code === "KeyT"){
        TheaterMode.click();
    }
    if (event.code === "KeyD"){
        videoPlayer.src = "Insert_Songs/Theater D.mp4";
        videoPlayer.play();
        currentIndex = -1;
        newcurrentIndex = -1;
    }
    if (event.code === "KeyO"){
        videoPlayer.src = "Openings_and_Endings/S1 Ending.mp4";
        videoPlayer.play();
        currentIndex = -1;
        newcurrentIndex = -1;
    }
    if (event.code === "KeyP"){
        videoPlayer.src = "Openings_and_Endings/S2 Ending.mp4";
        videoPlayer.play();
        currentIndex = -1;
        newcurrentIndex = -1;
    }
    if (event.code === "KeyS"){
        videoPlayer.src = "Openings_and_Endings/ED1 - STYX HELIX slow.mp4";
        videoPlayer.play();
        currentIndex = -1;
        newcurrentIndex = -1;
    }
});
    
let isAnimatingbutton = false;
// Next and Back button implementation:
nextButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    nextClickCount++;
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    backButton.disabled = true;
    if (nextClickCount == 1){
        navbarContent.style.display = 'none';
        nextnavbar.style.display = 'flex';
        lastnavbar.style.display = 'none'
        nextButton.style.display ='inline';
        backButton.style.display ='inline';
        nextnavbar.classList.add('fade-in');
        backButton.classList.add('fade-in');
        nextButton.classList.add('fade-in');
    }
    else if (nextClickCount == 2){
        navbarContent.style.display = 'none';
        nextnavbar.style.display = 'none';
        lastnavbar.style.display = 'flex'
        nextButton.style.display ='none';
        backButton.style.display ='inline';
        lastnavbar.classList.add('fade-in');
        backButton.classList.add('fade-in');
    }
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        backButton.disabled = false;
        }, 801);
})
backButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    nextClickCount--;
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    nextButton.disabled = true; // Disable the clickable element
    if (nextClickCount == 0){
        navbarContent.style.display = 'flex';
        nextnavbar.style.display = 'none';
        lastnavbar.style.display = 'none'
        nextButton.style.display ='inline';
        backButton.style.display ='none';
        navbarContent.classList.add('fade-in');
        nextButton.classList.add('fade-in');
    }
    else if (nextClickCount == 1){
        navbarContent.style.display = 'none';
        nextnavbar.style.display = 'flex';
        lastnavbar.style.display = 'none'
        nextButton.style.display ='inline';
        backButton.style.display ='inline';
        nextnavbar.classList.add('fade-in');
        backButton.classList.add('fade-in');
        nextButton.classList.add('fade-in');
    }

    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        nextButton.disabled = false; // Disable the clickable element
        }, 801);
})
nextnavbar.addEventListener('animationend', () => {
    nextnavbar.classList.remove('fade-in');
})
backButton.addEventListener('animationend', () => {
    backButton.classList.remove('fade-in');
})
navbarContent.addEventListener('animationend', () => {
navbarContent.classList.remove('fade-in');
})
nextButton.addEventListener('animationend', () => {
    nextButton.classList.remove('fade-in');
})
/*
window.addEventListener('load', function() {
    setTimeout(function(){ 
        Swal.fire({
            html: '<b>Happy Halloween!</b> 🎃',
            imageUrl: "Other_Files/Halloween_poster.jpg",
            imageHeight: "80vh",
            imageWidth: "auto",
            showCloseButton: true,
            showConfirmButton: false,
            background: "#716add",
            color: "#eb6123",
            backdrop: `
                rgba(0,0,123,0.4)
            `,
            showClass: {
                popup: `
                    animate__animated
                    animate__fadeIn
                    animate__faster
                `
            },
            hideClass: {
                popup: `
                    animate__animated
                    animate__fadeOut
                    animate__faster
                `
            },
    })},2000)
});
*/
function simulateClick() {
    // Get the element at the bottom right corner of the screen
    const elementAtPoint = document.elementFromPoint(window.innerWidth - 10, window.innerHeight - 100);
    // Check if the element is found and trigger a click event
    if (elementAtPoint) {
        elementAtPoint.click();
    }
}

async function togglePictureInPicture() {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else {
        try {
            await videoPlayer.requestPictureInPicture();
        } catch (error) {
            console.error('Error entering Picture-in-Picture mode:', error);
        }
    }
}

function openFullscreen() {
    if (videoPlayer.requestFullscreen) {
      videoPlayer.requestFullscreen();
    } else if (videoPlayer.webkitRequestFullscreen) { /* Safari */
      videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) { /* IE11 */
      videoPlayer.msRequestFullscreen();
    }
  }

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

const TheaterMode = document.getElementById('Theater');
const ButtonContainer = document.getElementsByClassName('button-container');
const paragraph = document.getElementById('paragraph');
const ReZeroCast = document.getElementById('subaru');
const GitHub = document.getElementById('github');
const ExitTheaterModeButton = document.getElementById('ExitTheaterModeButton');
const KeyboardControls = document.getElementById("KeyboardControls")
const navbar = document.getElementById("oldtopnav")
let TheaterModeFlag = false;
let TheaterModeClickCount = 0;

TheaterMode.addEventListener('click',function() {
    TheaterModeClickCount++;
    if (TheaterModeClickCount%2==1){
        navbarContent.style.display = 'none';
        nextnavbar.style.display = 'none';
        lastnavbar.style.display = 'none';
        paragraph.style.display = 'none';
        ReZeroCast.style.display = 'none';
        Trademark.style.display = 'none';
        GitHub.style.display = 'none';
        KeyboardControls.style.display = 'none';
        moveableimg.style.setProperty('display', 'none', 'important');
        textToChange.style.display = 'none';
        for (let i = 0; i < ButtonContainer.length; i++) {
            ButtonContainer[i].style.display = 'none';
        }
        videoPlayer.style.position = 'relative';
        videoPlayer.style.width =  '160vh';
        videoPlayer.style.height = '90vh';
        videoPlayer.style.margin = '5vh auto';
        body.style.backgroundColor = '#000000';
        body.style.backgroundImage = 'none';
        document.documentElement.requestFullscreen();
        TheaterModeFlag = true;
        ExitTheaterModeButton.style.display ='flex';
        navbar.style.marginTop = '2vh'
    }
    else{
        if (nextClickCount == 0) {
            navbarContent.style.display = 'flex';
            nextnavbar.style.display = 'none';
            lastnavbar.style.display = 'none'
        }
        else if (nextClickCount == 1){
            nextnavbar.style.display = 'flex';
            navbarContent.style.display = 'none';
            lastnavbar.style.display = 'none'
        }
        else if (nextClickCount == 2) {
            nextnavbar.style.display = 'none';
            navbarContent.style.display = 'none';
            lastnavbar.style.display = 'flex'
        }
        paragraph.style.display = 'block';
        ReZeroCast.style.display = 'block';
        Trademark.style.display = 'block';
        GitHub.style.display = 'block';
        KeyboardControls.style.display = 'flex';
        moveableimg.style.setProperty('display', 'inline', 'important');
        textToChange.style.display = 'inline';
        for (let i = 0; i < ButtonContainer.length; i++) {
            ButtonContainer[i].style.display = 'block';
        }
        body.style.backgroundImage = 'url(Other_Files/bg-tv.png)';
        body.style.backgroundColor = '#FFFFFF';
        videoPlayer.style.width =  'auto';
        videoPlayer.style.height = '46.855vh';
        videoPlayer.style.margin = '0 auto';
        videoPlayer.style.marginTop = '2vh';
        navbar.style.marginTop = '3vh'
        ExitTheaterModeButton.style.display ='none';
        TheaterModeFlag = false;
        closeFullscreen();
        }
})
function ExitTheaterMode() {
    TheaterMode.click();
}
document.addEventListener("DOMContentLoaded", function() {
MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`), // [1]
    onClose: modal => console.info(`${modal.id} is hidden`), // [2]
    openTrigger: 'data-custom-open', // [3]
    closeTrigger: 'data-custom-close', // [4]
    openClass: 'is-open', // [5]
    disableScroll: true, // [6]
    disableFocus: true, // [7]
    awaitOpenAnimation: true, // [8]
    awaitCloseAnimation: true, // [9]
    debugMode: false // [10]
  });
})
var button = document.querySelector('#KeyboardControls');
button.addEventListener('click', function(){
    MicroModal.show('modal-1', { awaitCloseAnimation: true,})
});

// Network error handling
videoPlayer.addEventListener('error', (event) => {
    if (event.target.error.code === 2) { // 2 usually corresponds to network errors
        console.error('Unable to load video. Please check your internet connection or try again later.', event.target.error);
    }
});
