// Polyfill for MediaSession API
if (!('mediaSession' in navigator)) {
    navigator.mediaSession = {
        setActionHandler: function() {},
        setPositionState: function() {},
        metadata: null
    };
}

if (typeof MediaMetadata !== 'function') {
    window.MediaMetadata = function(metadata) {
        this.title = metadata.title || '';
        this.artist = metadata.artist || '';
        this.album = metadata.album || '';
        this.artwork = metadata.artwork || [];
    };
}
// DOM <video> element for preloading
const nextVideo = document.createElement('video');
const URL = "https://r2-cache-worker-en.thaituan150806.workers.dev/"

var videoUrls = [
    `${URL}OP1 - Redo.mp4`,
    `${URL}ED1 - STYX HELIX.mp4`,
    `${URL}OP2 - Paradisus - Paradoxum.mp4`,
    `${URL}ED2 - Stay Alive.webm`,
    `${URL}OP3 - Realize.mp4`,
    `${URL}ED3 - Memento.mp4`,
    `${URL}OP4 - Long shot.mp4`,
    `${URL}ED4 - Believe in you.webm`,
    `${URL}OP5 - Reweave.mp4`,
    `${URL}ED5 - NOX LUX.mp4`,
];
var newvideoUrls = [
    `${URL}STRAIGHT BET.mp4`,
    `${URL}Bouya no Yume yo.mp4`,
    `${URL}Memories.mp4`,
    `${URL}White White Snow.mp4`,
    `${URL}Requiem of Silence.mp4`,
    `${URL}Wishing.mp4`,
    `${URL}Yuki no hate ni Kimi no na wo.mp4`,
    `${URL}Door.mp4`,
    `${URL}What you don't know.mp4`,
    `${URL}I Trust You.mp4`,
];
    
let isPosterSet = false; //Track if poster is set
let currentIndex = 0; // For videoUrls
let newcurrentIndex =0; // For newvideoUrls
let clickCount = 0;
let preloadedVideos = [];
let disablePreloading = false;
let nextVideoTimeout;
let videoLoopingTimeout;
let loopclickCount = 0;
let enableLoopingListener = null;
let delay = 0;
let isAnimating = false;
let FclickCount = 0;
let nextClickCount = 0;
let keyB = 0
let TheaterModeFlag = false;
let TheaterModeClickCount = 0;
let currentVolume = 1 // 1 stands for maximum volume, 0 stands for muted
let errorReloadTimeout;

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
    newcurrentIndex = newvideoUrls.indexOf(videoName);
    if (!isPosterSet) {
        videoPlayer.poster = "Other_Files/black.png";
        isPosterSet = true;
    }
    // Clear the timeout for playNextVideo
    clearTimeout(nextVideoTimeout);
    clearTimeout(videoLoopingTimeout); 
    clearTimeout(errorReloadTimeout);
    simulateClick();
}
const videoPlayer = document.getElementById('videoPlayer');
videoPlayer.addEventListener('play',function(){
    clearTimeout(nextVideoTimeout);
    clearTimeout(videoLoopingTimeout);
    clearTimeout(errorReloadTimeout);
    if (!isPosterSet) {
        videoPlayer.poster = "Other_Files/black.png";
        isPosterSet = true;
    }
    let name = cleanVideoSrcName(videoPlayer.src);
    if (name.substr(0,2) == 'OP' || name.substr(0,2) == 'ED'){
        let firstIndexOfHyphen = name.indexOf(' - ')
        name = name.substr(firstIndexOfHyphen + 3)
    }
    let artist = ''
    let musicArtwork = ''
    if (name == 'STYX HELIX' || name == 'Paradisus - Paradoxum' || name == 'NOX LUX' ||name == 'STRAIGHT BET' || name == 'Season 1 Ending' || name == 'Theater D' || name == 'STYX HELIX slow' || name == 'STYX HELIX nocut'){ 
        artist = 'Myth & Roid'
        if (name == 'STYX HELIX')
            musicArtwork = {
                src: "Icons/artworks/STYX_HELIX_Cover.webp",
                sizes: "1008x1000",
                type: "image/webp",
              }
        else if (name == 'Paradisus - Paradoxum')
            musicArtwork = {
                src: "Icons/artworks/Paradisus-Paradoxum_Cover.webp",
                sizes: "1000x993",
                type: "image/webp",
              }
        else if (name == 'NOX LUX')
            musicArtwork = {
                src: "Icons/artworks/NOX_LUX_Cover.webp",
                sizes: "1080x1080",
                type: "image/webp",
              }
        else if (name == 'STRAIGHT BET')
            musicArtwork = {
                src: "Icons/artworks/STRAIGHT_BET_Cover.jpg",
                sizes: "721x720",
                type: "image/jpeg",
              }
        else if (name == 'Season 1 Ending'){
            musicArtwork = {
                src: "Icons/artworks/STYX_HELIX_Cover.webp",
                sizes: "1008x1000",
                type: "image/webp",
              }
        }
        else if (name == 'Theater D')
            musicArtwork = {
                src: "Icons/artworks/Theater_D_Cover.jpg",
                sizes: "1080x1080",
                type: "image/jpeg",
              }
        else if (name == 'STYX HELIX slow'){
            name = "STYX HELIX (slow ver.)"
            musicArtwork = {
                src: "Icons/artworks/STYX_HELIX_Cover.webp",
                sizes: "1008x1000",
                type: "image/webp",
              }
        }
        else if (name == 'STYX HELIX nocut') {
            artist = 'Myth & Roid'
            musicArtwork = {
                src: "Icons/artworks/STYX_HELIX_Cover.webp",
                sizes: "1008x1000",
                type: "image/webp",
            }
        }
    }
    else if (name == 'Long shot' || name == 'Season 2 Ending'){
        artist = 'Mayu Maeshima'
        musicArtwork = {
            src: "Icons/artworks/Long_Shot_Cover.webp",
            sizes: "1400x1400",
            type: "image/webp",
          }
    }
    else if (name == 'Redo' || name == 'Realize' || name == 'Reweave'){
        artist = 'Konomi Suzuki'
        if (name == 'Redo')
            musicArtwork = {
                src: "Icons/artworks/Redo_Cover.webp",
                sizes: "997x992",
                type: "image/webp",
            }
        else if (name == 'Realize')
            musicArtwork = {
                src: "Icons/artworks/Realize_cover.webp",
                sizes: "500x500",
                type: "image/webp",
            }
        else if (name == 'Reweave')
            musicArtwork = {
                src: "Icons/artworks/Reweave_Cover.webp",
                sizes: "1600x1600",
                type: "image/webp",
            }
    }
    else if (name == 'Stay Alive' || name == 'Door' || name == 'I Trust You' || name == 'Bouya no Yume yo'){
        artist = 'Emilia (CV: Rie Takahashi)'
        if (name == 'Stay Alive')
            musicArtwork = {
                src: "Icons/artworks/Stay_Alive_Cover.webp",
                sizes: "1280x1281",
                type: "image/webp",
            }
        else if (name == 'Door')
            musicArtwork = {
                src: "Icons/artworks/Character_song_album.webp",
                sizes: "1280x1280",
                type: "image/webp",
            }
        else if (name == 'I Trust You')
            musicArtwork = {
                src: "Icons/artworks/Character_song_album.webp",
                sizes: "1280x1280",
                type: "image/webp",
            }
        else if (name == 'Bouya no Yume yo')
            musicArtwork = {
                src: "Icons/artworks/Character_song_album.webp",
                sizes: "1280x1280",
                type: "image/webp",
            }
    }
    else if (name == 'Memento' || name == 'Believe in you' || name == 'Yuki no hate ni Kimi no na wo' || name == 'White White Snow'){
        artist = 'nonoc'
        if (name == 'Memento')
            musicArtwork = {
                src: "Icons/artworks/Memento_cover.webp",
                sizes: "500x500",
                type: "image/webp",
            }
        else if (name == 'Believe in you')
            musicArtwork = {
                src: "Icons/artworks/Believe_in_you_cover.webp",
                sizes: "500x500",
                type: "image/webp",
            }
        else if (name == 'Yuki no hate ni Kimi no na wo')
            musicArtwork = {
                src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
                sizes: "640x640",
                type: "image/webp",
            }
        else if (name == 'White White Snow')
            musicArtwork = {
                src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
                sizes: "640x640",
                type: "image/webp",
            }
    }
    else if (name == 'Memories'){
        artist = 'Azuna Riko'
        musicArtwork = {
            src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
            sizes: "640x640",
            type: "image/webp",
        }
    }
    else if (name == 'Wishing'){
        artist = 'Rem (CV: Inori Minase)'
        musicArtwork = {
            src: "Icons/artworks/Character_song_album.webp",
            sizes: "1280x1280",
            type: "image/webp",
        }
    }
    else if (name == 'What you don\'t know'){
        artist = 'Ram (CV: Rie Murakawa)'
        musicArtwork = {
            src: "Icons/artworks/Character_song_album.webp",
            sizes: "1280x1280",
            type: "image/webp",
        }
    }
    else if (name == 'Requiem of Silence'){
        artist = 'Kenichiro Suehiro'
        musicArtwork = {
            src: "Icons/artworks/Re_Zero_Soundtrack_Cover.webp",
            sizes: "320x317",
            type: "image/webp",
        }
    }

    navigator.mediaSession.metadata = new MediaMetadata({
        title: name, //the title of the media
        artist: artist, //the artist of the media
        artwork: 
        [
            musicArtwork
        ]
      });
    document.title = "「" + name + "」";
})

navigator.mediaSession.setActionHandler("play", () => {
    videoPlayer.play()
});
navigator.mediaSession.setActionHandler("pause", () => {
    videoPlayer.pause()
});
navigator.mediaSession.setActionHandler("previoustrack", () => {
    previousVideoTrack()
});
navigator.mediaSession.setActionHandler("nexttrack", () => {
    nextVideoTrack()
});

// Automatically attempt reloading the current video if any error happen with 7 seconds interval
videoPlayer.addEventListener('error', () => {
    const videoName = cleanVideoSrcName(videoPlayer.src);
    clearTimeout(errorReloadTimeout);
    errorReloadTimeout = setTimeout(() => {
        console.log('Attempting to reload:', videoName);
        videoPlayer.src = videoPlayer.src
        videoPlayer.play().catch(error => {
            console.error('Error when playing:', error, 'Reloading in 7 seconds.');
        });
    }, 7000)
})

// Automatically play next video after ending with a delay
function playNextVideo() {
    // Delay before switching to the next video
    nextVideoTimeout = setTimeout(function() {
        if (clickCount % 2 === 1) {
            newcurrentIndex = (newcurrentIndex + 1) % newvideoUrls.length;
            videoPlayer.src = newvideoUrls[newcurrentIndex];
        } else {
            currentIndex = (currentIndex + 1) % videoUrls.length;
            videoPlayer.src = videoUrls[currentIndex];
        }
        videoPlayer.poster = "Other_Files/black.png"; // Clear the poster attribute
        videoPlayer.play();
    }, delay);     
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
const newInsertSongs = document.getElementById('newInsertSongs');
const bodytext =document.getElementById('bodytext');
const songname =document.getElementById('songname');
const disablePreloadingbutton = document.querySelector('.subaru');
const enablePreloadingbutton = document.querySelector('.trademark');
const nextButton = document.getElementById('nextButton');
const backButton = document.getElementById('backButton');
const newnextButton = document.getElementById('newnextButton');
const newbackButton = document.getElementById('newbackButton');
const S3 = document.getElementById('Season3Content');
const SidebarButton = document.getElementById('SidebarButton');
const Trademark = document.getElementById('trademark');
const DelayButton = document.getElementById('Delay');
const Openings = document.getElementById('Openings');
const Endings = document.getElementById('Endings');
const Insert_Songs = document.getElementById('Insert_Songs');
const Openings_Content = document.getElementById('Openings_Content');
const Endings_Content = document.getElementById('Endings_Content');
const Insert_Songs_Content = document.getElementById('Insert_Songs_Content');

moveableimg.addEventListener('click', function(){
        
    if (isAnimating || this.hasAttribute('disabled')) {
    return; // Exit the function if an animation is already in progress or the element is disabled
    }
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    clickCount++;
    nextClickCount = 0;
    if (clickCount % 2 === 1) {
        textToChange.innerHTML = "All <s> OPs and EDs</s> Insert Songs";
        bodytext.innerHTML = "Insert Songs!"
        songname.innerHTML = "Openings and Endings"
        navbarContent.style.display = 'none';
        newnavbarContent.style.display ='flex';
        videoPlayer.src= newvideoUrls[0];
        newcurrentIndex = 0;
        currentIndex = -1;
        nextClickCount = 0;
        clearTimeout(nextVideoTimeout);
        clearTimeout(videoLoopingTimeout);
        textToChange.classList.add('fade-in-title');
        bodytext.classList.add('fade-in-bodytext');
        songname.classList.add('fade-in-songname');
        newnavbarContent.classList.add('slide-in');
        moveableimg.classList.add('fade-in');
        backButton.style.display ='none';
        nextButton.style.display ='none';
        newnextButton.style.display = 'inline';
        newbackButton.style.display = 'none';
        newnextButton.classList.add('fade-in-songname')
        S3.style.display='none';
        Insert_Songs.style.display = '';
        Endings.style.display = 'none';
        Openings.style.display = 'none';
        Openings_Content.style.display = 'none';
        Endings_Content.style.display = 'none';
        Insert_Songs_Content.style.display = '';
        SidebarButton.innerHTML = "Switch to OPs and EDs";
        console.log("- INSERT SONGS MODE - ");
        videoPlayer.addEventListener('loadeddata', () => {
            if (isPosterSet)
                videoPlayer.currentTime = 0;
        },{once:true})
    }
    else {
        textToChange.innerHTML = "All OPs and EDs ";
        bodytext.innerHTML = "Openings and Endings!";
        songname.innerHTML = "Insert Songs"
        navbarContent.style.display ='flex';
        newnavbarContent.style.display ='none';
        newInsertSongs.style.display = 'none';
        videoPlayer.src = videoUrls[0];
        currentIndex = 0;
        newcurrentIndex = -1;
        nextClickCount = 0;
        clearTimeout(nextVideoTimeout); 
        clearTimeout(videoLoopingTimeout);
        textToChange.classList.add('fade-in-title');
        bodytext.classList.add('fade-in-bodytext');
        songname.classList.add('fade-in-songname');
        nextButton.classList.add('fade-in-songname')
        navbarContent.classList.add('slide-in');
        moveableimg.classList.add('fade-in');
        nextButton.style.display ='inline';
        newnextButton.style.display = 'none';
        newbackButton.style.display ='none';
        Insert_Songs.style.display='none';
        Openings.style.display = '';
        Endings.style.display = '';
        Openings_Content.style.display = '';
        Endings_Content.style.display = '';
        Insert_Songs_Content.style.display = 'none';
        SidebarButton.innerHTML = "Switch to Insert Songs";
        console.log("- OPENINGS AND ENDINGS MODE - ");
        videoPlayer.addEventListener('loadeddata', () => {
            if (isPosterSet)
                videoPlayer.currentTime = 0;
        },{once:true})
    }
    setTimeout(() => {
    isAnimating = false; // Reset the flag once the animation is complete
    this.removeAttribute('disabled'); // Re-enable the clickable element
    }, 5751); // Adjust the timeout value to match your animation duration
});
// Remove the animation class after the animation ends
textToChange.addEventListener('animationend', () => {
    textToChange.classList.remove('fade-in-title');
});
bodytext.addEventListener('animationend', () => {
    bodytext.classList.remove('fade-in-bodytext');
});
songname.addEventListener('animationend', () => {
    songname.classList.remove('fade-in-songname');
});
navbarContent.addEventListener('animationend', () => {
    navbarContent.classList.remove('slide-in');
    navbarContent.classList.remove('fade-in');
});
newnavbarContent.addEventListener('animationend', () => {
    newnavbarContent.classList.remove('slide-in');
    newnavbarContent.classList.remove('fade-in');
});
moveableimg.addEventListener('animationend', () => {
    moveableimg.classList.remove('fade-in');
});
S3.addEventListener('animationend', () => {
    S3.classList.remove('fade-in');
})
newInsertSongs.addEventListener('animationend', () => {
    newInsertSongs.classList.remove('fade-in');
})
backButton.addEventListener('animationend', () => {
    backButton.classList.remove('fade-in');
})
nextButton.addEventListener('animationend', () => {
    nextButton.classList.remove('fade-in-songname');
    nextButton.classList.remove('fade-in');
})
newbackButton.addEventListener('animationend', () => {
    newbackButton.classList.remove('fade-in');
})
newnextButton.addEventListener('animationend', () => {
    newnextButton.classList.remove('fade-in-songname');
    newnextButton.classList.remove('fade-in');
})

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
        root.style.setProperty('--subarumouse', 'image-set(url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAllBMVEUAAAAkJCQfHx8SEhIMDAwNDQ0JCQkKCgoODg7x8fFycnL8/Pz9/f3Dw8MJCQn6+vqNjY3////y8vLp6ene3t7u7u7S0tLr6+vDw8P09PT29vb4+Pju7u7a2trw8PClpaVbW1ubm5utra0jKDP///8/Q03j5OWtrrNaXmbx8vLIycyRk5loa3MxNkCDhox2eYDx8fK6vL8DdzWRAAAAI3RSTlMABAcIDQsSFQ+YJePhKhrUOvCojG5nYVdUyMa0iYN3My0cGZgGfOIAAAD+SURBVDjLzZLZcsIwDEWxvJJAwtZC98WKk5LQ5f9/rso4Mx4UwjN61RndI9mzmypxvStAghDTEOzXOF/KSUTIMtS4eNUwQYDK/3xFyB0hFweo+Zf3vgm42JPLGAC1w8ZT/QR8WsYgFpHht/cDsult2ZLa5kcfq2qRFgJGaEMSQ0XbGJMk3D1JJOS4/hTMkiRSv6vx4zyEJMpB4tQGRHxWwC5BEqe+3/3iw8shMzoCI4kOy1VRWKOkGF+ipfSQvxfGaZmWSBKPJFHjyjqdHp5LVLgpXDzjGHAHbGiA0anNMrIccWsVTPRpxNt2Z5k9+xSGbccAkJJ/Fo70NbvB+gfwVhoJL6w+jwAAAABJRU5ErkJggg==) 1x, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAvVBMVEUAAAAdHR0TExMSEhIODg4KCgoHBwcGBgYHBwcJCQkMDAwGBgb+/v78/PwGBgYGBgbBwcH39/dra2vq6urExMT19fXu7u74+Pj09PTk5OTs7OzQ0NDm5ub+/v75+fn7+/vo6Oji4uLv7+/X19e1tbWysrKIiIjX19fa2trg4ODU1NRSUlKEhIS1tbW8vLwjKDP////j5OU/Q012eICtrrNaXmbx8fKfoaaRlJkxNkDIyczW19loa3ODhoxNUFlr0DWwAAAAL3RSTlMABgoIDQ8XEhUUERnx4yAbKsYnjFOmm7SXfWhiWeHU0p+Rd3JaRT1zS0k7Mh8YF+5vndUAAAIwSURBVFjD7ZbbUttAEERhtaurLcl2HDCXBJJA7tFYiMQBkv//rPRIU0FClFcrqige3O/d6jmz4/LeTju9UO1DT3F7P7573tgQ+PMZ0emRUsgY4/fyU2JNT5RCD/fvqyXcPwk6yDVP4lpAvyW6KzfEWuaug6AAB1wXRVkR6zDXLhEooMwh0aaAmojpO6cETBAfE90Uta7XdcSR5kGGB8xh+l00umoiTga34AD/TQ2hE3EgKIYFvCb6VfxXZyGDIIYCQdRaiFL2EvvKRAJB1F0IWtgqmKALobsQKwpACB5AeGQhW5+ijsNXRLf3zt5CkOAEobeQz0iwzDDDPRWiPs2JRoDLS+hG4NK/YJ1bZ2hB6OuW6JOyQpg8CqG8+1MxyG+DIFw9fAkVytdaxNshKEBYAEJ/hbUmq0hvbyAQ1u3uN413dvbxIgkDDQZOEP6u2X3+IU3TDH6jPEuADhKG0N4cnX2FO0v8KDCYYM92Dm0I5Rqfx9fhDtluPWpAiNsQKvgv0/rjMezit0FIAKFs+KP/cZr5mB323jXbIWCAJfyR2K1+OWl/RVRJgekl/LHuuC0U5SVIgfMswep4d0PlYQaBwAXm6K+76OwQ5Bx4he8TH/3Z7pCgTbjiH/cNCmR4u/369kVe1H8TuEBklHOApw1+llizJIydCzBGE4SLKU0Wc/hrgK4VOMGf4/W7+4WCMnEU4HgEgHMAYzBGaz3OjwBMwZL+4zpA/PzHi9077fRs+gdaMIOfVRGM4AAAAABJRU5ErkJggg==) 2x) 8 8, default');
        Trademark.style.cursor = "var(--pointermouse)"
        disablePreloading = true;
        // Added failsafe if mistakenly clicked on picture (in IF statements: "!const" = "const === false")
        if (disablePreloading){
            enablePreloadingbutton.addEventListener('click',function(){
                alert("Preloading enabled!");
                console.log('Preloading enabled!');
                disablePreloading = false;
                root.style.setProperty('--subarumouse', 'image-set(url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAmVBMVEUAAAAbGxsZGRkTExMICAgJCQkPDw8QEBB1YfIICAh0X/BwXeltWuFZSrdyXuxpV9xnVdZiU8tvXehyX+1wXehuXOZfT8VdUcE0LWxyX+1zX+1lU8xmU81hUchVSbJYTLdSR6P///91YfOGdfX39f6pnPfLxPvu6/3Y0/zCuvq6sPmxpviXiPaPfvV+a/R9a/TDuvqhkvegkvdrWLcYAAAAIXRSTlMABQcLEBQNCfEX45aKVcaOfye4lId2Tykk1LRycWFCQBntRKz0AAABCUlEQVQ4y83S11LDMBAF0KhLNm6k0tmVbCchBfj/j8MaGHmIZHhjuLNve7xWm/2vkF/azXze0Ok+Xesz6vX0FJVj359zNSlYfnJwyDibEIStcAs73HCmKEkBucFX2KLWt1ovWGwIE1kLPbatr3zZREKJmzdwCOALMXsmEbg+AnyBvsclJRGwAKFwwcjFGp7wHcbglfwOqCyt+xFw/QIAnQUA23nAaQrs0X+9T04oT26c4LCW9OIkH/VxXESHq2gX4h4PAdhMBBD+Ye6w/Wy7Fh84jc6amwpt58DtLFZCRoAwbooMfcrCcJW4ccWFKeqqLoxIvxtC2UCMb/ubSomBSCnDm0qjIbM/zgdM/h9ZMvytJwAAAABJRU5ErkJggg==) 1x, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAsVBMVEUAAAAlJSUVFRUODg4KCgoICAgGBgYHBwcJCQkHBwd0YPIHBwcGBgYLCwtjU810X+9zX+9kU8xRQp5vXOdEOox0YPBzX+9wXelvXOZnVtdQRKc0LWpxXupyX+1rWd5tXORhUclWR7JkVMxORKJwXedwXupqWdtYSbZiVcv///91YfOGdfXu6/26sPn39f6onPfd1/x+a/TUzvuxpvipnffDuvqXiPbl4f3LxPuhkveypviacpDcAAAAKXRSTlMABQkMDxMWEBIY8RseFXLj00wZhzjiw5aof0Ylx8SeZmFXOTG4tmpXJ53eMHQAAAJ8SURBVFjD7ZfXdtswEEQTopAARXVbzXZc0jSUZFWX/P+HZQkgKocyQDMvOUnmAUcvczG7WEjQh//6a/XxN+1W9e0H1fVH3e/3UWQItfzdngb0oBvVIJjt2zBq1yGQPxoAyHMAPUaE9wdgGphPp3NAd+sQ2D2QT0k50GHROwlFgAcH2ACDmJXaEAZMNDAjwBq4FpwIVpUBXHwBdgRYAFomRCBZRlXACNi6JvSliBkrMfyAbOya8Aq0NK6/di41Lj85RhjAxASA7eKxeswhwiWolu3iDifqcGYJoQSJvALW9hgeF7PHX6u2hQQIBjAEXgjwbIIs3EoKTbdLEMseMCfAzLbCrU6dIoMfwLMRsHHWw+oKuWRBQJw1gW0J4ArR3EugDhHgFni1pvKKOBDBJXgyo5gfrw4gOPMmIMCDdoCyAGQ88gN4cgHks7cBMaNCfYAOTMPeAkhvE4pTHJozCAB8LWgDy6nVHPP9h+qAi0MFAPYfTgDeuxQAqMSfgAtTQv0EPBkAT2cBdpSDPUg6cBHKTVwC7cxMovc2fwZWz9Nz2gBDEfsnkXExaRHh7CjlwC2NsjcB1aD6rfPD/AJcqIQHb6NQfX2OMMuBpu1h6Fs1HRtC2d9S/ttMADMKMr2DJZz60d+PkTcCFyptAljt9vbFfAWgqdxlrkpAvl0uaPP1j8Kum6m0AQIA00iZ0lmcqD1OpeCRAYQJnAiN5hFCjxqF3waoREikShvfbq40mds3d41UycT5qxJEgXAiu4iN3wHChIjHSSaVUmlKixTF9tZfmcAoRSJEJoRIaHdW/m0PI4hhxDyvC++j+0h1nr1OUf3HPzFqmf+ov0//hn4CGZ+XfMz98P8AAAAASUVORK5CYII=) 2x) 10 6, pointer');
                Trademark.style.cursor = "var(--normalmouse)"
            }, {once :  true});
        }
    }
}, );
// Video preloading 
videoPlayer.addEventListener('timeupdate', function() {
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;
    if (duration - currentTime <= 5 && !disablePreloading) {

    // Preload multiple videos based on the current video type
        if (clickCount % 2 === 1) {
            const nextNewIndex = (newcurrentIndex + 1) % newvideoUrls.length;
            const newName = cleanVideoSrcName(newvideoUrls[nextNewIndex]);
            if (!preloadedVideos.includes(newvideoUrls[nextNewIndex])) {
                nextVideo.src = newvideoUrls[nextNewIndex];
                nextVideo.preload = 'auto';
                preloadedVideos.push(newvideoUrls[nextNewIndex]);
                console.log('Preloaded video:', newName);                                      
            }
        }
        else {
            const nextIndex = (currentIndex + 1) % videoUrls.length;
            const name = cleanVideoSrcName(videoUrls[nextIndex]);
            if (!preloadedVideos.includes(videoUrls[nextIndex])) {
                nextVideo.src = videoUrls[nextIndex];
                nextVideo.preload = 'auto';
                preloadedVideos.push(videoUrls[nextIndex]);
                console.log('Preloaded video:', name);  
            }
        }
    }      
});

function disableFocus(element) {
    element.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
}
disableFocus(videoPlayer);

// Reset preloadedVideos array every time a video ends to optimize memory usage.
function ResetArray(){
    preloadedVideos = [];
}
videoPlayer.addEventListener('ended',ResetArray)

function cleanVideoSrcName(src){
    const startIndex = src.lastIndexOf("/")+1;
    const lastDot = src.lastIndexOf('.'); // exactly what it says on the tin
    const cleanedPath = src.substring(startIndex,lastDot);
    return cleanedPath.replace(/%20/g, ' ');
}

// Enable and Disable Looping functions
enableLoopingListener = function EnableLooping() {
    clearTimeout(nextVideoTimeout);
    videoLoopingTimeout = setTimeout(() => {
        videoPlayer.play();
    },delay)
};

const loopVideo = document.querySelector('#loop')
const loopText = document.querySelector('.looptext')
loopVideo.addEventListener('click',function() {
    loopclickCount++
    loopVideo.classList.toggle('loop-active');
    const name = cleanVideoSrcName(videoPlayer.src)
    if (loopclickCount % 2 == 1){
        loopText.innerHTML = "Disable looping";
        if (videoPlayer.ended)
            enableLoopingListener();
        videoPlayer.removeEventListener('ended', ResetArray);
        videoPlayer.addEventListener('ended', enableLoopingListener);
        console.log('Video looping enabled for: ', name);
        alert("Video looping enabled for: " + name);   
    }
    else {
        loopText.innerHTML = "Enable looping";
        if (videoPlayer.ended){
            clearTimeout(videoLoopingTimeout)
            playNextVideo();
        }
        videoPlayer.removeEventListener('ended', enableLoopingListener);
        videoPlayer.addEventListener('ended', ResetArray);
        console.log('Video looping disabled for: ', name);
        alert("Video looping disabled for: " + name);
    }
    if (TheaterModeFlag)
        setTimeout(Fullscreen,0)
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
    if (clickCount % 2 == 1){
        newvideoUrls = shuffleArray(newvideoUrls);
        playVideo(newvideoUrls[0]);
        preloadedVideos = [];
    }
    else {
        videoUrls = shuffleArray(videoUrls);
        playVideo(videoUrls[0]);
        preloadedVideos = [];
    }
    alert("Videos shuffled! (check console logs for more info)");
// You can now use the shuffled videoUrls array for playing the songs in a random order
    if (TheaterModeFlag)
        setTimeout(Fullscreen,0)
    if (clickCount % 2 == 1)
        console.log('Shuffled videos to:', newvideoUrls);
    else
        console.log('Shuffled videos to:', videoUrls);
});
    
// Update the delay variable
function updateDelay(newDelay) {
    delay = newDelay * 1000; // Convert to milliseconds
}
// Add event listener for button click
document.getElementById("Delay").addEventListener("click", function() {
    // Prompt user for new delay
    let newDelay = parseFloat(prompt("Enter new transition delay in seconds: (Current delay: " + delay/1000 + " seconds)"));
    // Validate user input
    if (TheaterModeFlag)
        setTimeout(Fullscreen,0)
    if (isNaN(newDelay) || newDelay < 0) {
        alert("Invalid delay. Please enter a non-negative number.");
        return;
    }
    if (newDelay > 25) {
        alert("You really like to sleep when switching videos! (Delay not changed)");
        return;
    }
   
    // Update delay and optionally display confirmation
    updateDelay(newDelay);
    console.log("Delay updated to", newDelay, " seconds");
});

function nextVideoTrack(){
    if (clickCount % 2 === 1) {
        const nextnewcurrentIndex = (newcurrentIndex + 1) % newvideoUrls.length;
        playVideo(newvideoUrls[nextnewcurrentIndex]);
    }
    else {
        const nextcurrentIndex = (currentIndex + 1) % videoUrls.length;
        playVideo(videoUrls[nextcurrentIndex]);
    }
}

function previousVideoTrack() {
    if (clickCount % 2 === 1) {
        if (newcurrentIndex < 0)
            return
        if (newcurrentIndex > 0) 
            prevnewIndex = newcurrentIndex - 1
        else if (newcurrentIndex == 0) 
            prevnewIndex = newvideoUrls.length - 1
        playVideo(newvideoUrls[prevnewIndex]);
    }   
    else {
        if (currentIndex < 0)
            return
        if (currentIndex > 0) 
            prevIndex = currentIndex - 1;
        else if (currentIndex == 0) 
            prevIndex = videoUrls.length - 1
        playVideo(videoUrls[prevIndex])
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
    else if (event.code === "ArrowRight") {
        nextVideoTrack()
    }
    // Returning to the previous video using the playVideo function (doesn't work if used on first video)
    else if (event.code === "ArrowLeft") {
        previousVideoTrack()
    }
    else if (event.code === "Numpad1"||event.code === "Digit1")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[0]);
        }   
        else {
            playVideo(videoUrls[0]);
        }
    }
    else if (event.code === "Numpad2"||event.code === "Digit2")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[1]);
        }   
        else {
           playVideo(videoUrls[1]);
            }
    }
    else if (event.code === "Numpad3"||event.code === "Digit3")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[2]);
        }   
        else {
            playVideo(videoUrls[2]);
        }
    }
    else if (event.code === "Numpad4"||event.code === "Digit4")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[3]);
        }   
        else {
            playVideo(videoUrls[3]);
        }
    }
    else if (event.code === "Numpad5"||event.code === "Digit5")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[4]);
        }   
        else {
            playVideo(videoUrls[4]);
        }
    }
    else if (event.code === "Numpad6"||event.code === "Digit6")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[5]);
        }   
        else {
            playVideo(videoUrls[5]);
        }
    }
    else if (event.code === "Numpad7"||event.code === "Digit7")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[6]);
        }   
        else {
            playVideo(videoUrls[6]);
            }
    }
    else if (event.code === "Numpad8"||event.code === "Digit8")  {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[7]);
        }
        else {
            playVideo(newvideoUrls[7]);
        }      
    }
    else if (event.code === 'Numpad9'||event.code === "Digit9") {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[8]);
        }
        else {
            playVideo(newvideoUrls[8])   
        }
            
    }
    else if (event.code === 'Numpad0'||event.code === "Digit0") {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[9]);
        }
        else {
            playVideo(newvideoUrls[9])
        }   
    }
    else if (event.code === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior
        togglePlaylist();
    }
    else if (event.code === 'KeyQ') {
        shuffleButton.click();
    }   
    else if (event.code === 'KeyW') {
        loopVideo.click();
    }   
    else if (event.code === 'KeyE') {
        DelayButton.click();
    }
    else if (event.code === 'KeyR') {
        togglePictureInPicture();
    }
    else if (event.code === 'KeyF'){
        if ((document.fullscreenElement && document.fullscreenElement === videoPlayer) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement === videoPlayer) ||
            (document.msFullscreenElement && document.msFullscreenElement === videoPlayer)
        ) 
            closeFullscreen(); // Video is currently in fullscreen mode, so close fullscreen
        else 
            openFullscreen();  // Video is not in fullscreen mode, so open fullscreen
    }
    else if (event.code === "KeyC"){
        if (videoPlayer.hasAttribute('controls')) {
            videoPlayer.removeAttribute('controls');
        } 
        else {
            videoPlayer.setAttribute('controls', '');
        }
    }
    else if (event.code === "KeyT"){
        TheaterMode.click();
    }
    else if (event.code === "KeyD"){
        playVideo(`${URL}Theater D.mp4`)
    }
    else if (event.code === "KeyO"){
        playVideo(`${URL}Season 1 Ending.webm`);
    }
    else if (event.code === "KeyP"){
        playVideo(`${URL}Season 2 Ending.mp4`)
    }
    else if (event.code === "KeyS"){
        playVideo(`${URL}ED1 - STYX HELIX slow.mp4`);
    }
    else if (event.code === "KeyB"){
        ChangeStyxHelix();
    }
    else if (event.code === 'Escape') {
        if (TheaterModeFlag){
           TheaterMode.click() // Exit Theater Mode if Theater Mode is active
       }
    }
    else if (event.code === 'ArrowUp'){
        if (currentVolume + 0.1 > 1) // Check if the volume is already at 1
        {
            videoPlayer.volume = 1
            return;
        }
        videoPlayer.volume = currentVolume + 0.1
        currentVolume = videoPlayer.volume
    }
    else if (event.code === 'ArrowDown'){
        if (currentVolume - 0.1 < 0) // Check if the volume is already at 0
        {
            videoPlayer.volume = 0
            return;
        }
        videoPlayer.volume = currentVolume - 0.1
        currentVolume = videoPlayer.volume
    }
});

// Next and Back button implementation:
nextButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    nextClickCount++;
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    backButton.disabled = true;
    navbarContent.style.display = 'none';
    S3.style.display = 'flex';
    nextButton.style.display ='none';
    backButton.style.display ='inline';
    S3.classList.add('fade-in');
    backButton.classList.add('fade-in');
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        backButton.disabled = false;
        }, 2501);
})
backButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    nextClickCount--;
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    nextButton.disabled = true; // Disable the clickable element
    navbarContent.style.display = 'flex';
    S3.style.display = 'none';
    nextButton.style.display ='inline';
    backButton.style.display ='none';
    navbarContent.classList.add('fade-in');
    nextButton.classList.add('fade-in');
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        nextButton.disabled = false; // Disable the clickable element
    }, 2501);
})

// Next and Back button implementation (for Insert Songs):
newnextButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    nextClickCount++;
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    newbackButton.disabled = true;
    newnavbarContent.style.display = 'none';
    newInsertSongs.style.display = 'flex';
    newnextButton.style.display ='none';
    newbackButton.style.display ='inline';
    newInsertSongs.classList.add('fade-in');
    newbackButton.classList.add('fade-in');
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        newbackButton.disabled = false;
        }, 2501);
})
newbackButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    nextClickCount--;
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    newnextButton.disabled = true; // Disable the clickable element
    newnavbarContent.style.display = 'flex';
    newInsertSongs.style.display = 'none';
    newnextButton.style.display ='inline';
    newbackButton.style.display ='none';
    newnavbarContent.classList.add('fade-in');
    newnextButton.classList.add('fade-in');
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        newnextButton.disabled = false; // Disable the clickable element
    }, 2501);
})

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
const body = document.getElementById('body');
const ReZeroCast = document.getElementById('subaru');
const GitHub = document.getElementById('github');
const ExitTheaterModeButton = document.getElementById('ExitTheaterModeButton');
const KeyboardControls = document.getElementById("KeyboardControls")
const navbar = document.querySelector(".oldtopnav")

TheaterMode.addEventListener('click',function() {
    TheaterModeClickCount++;
    if (TheaterModeClickCount%2==1){
        navbarContent.style.display = 'none';
        nextButton.style.display = 'none';
        backButton.style.display = 'none';
        newnextButton.style.display = 'none';
        newbackButton.style.display = 'none';
        newnavbarContent.style.display = 'none';
        S3.style.display = 'none';
        newInsertSongs.style.display = 'none';
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
        if (document.pictureInPictureElement)
            document.exitPictureInPicture();
        TheaterModeFlag = true;
        ExitTheaterModeButton.style.display ='flex';
        navbar.style.marginTop = '2vh'
    }
    else {
        if (clickCount%2==1){
            if (nextClickCount == 1){
                newInsertSongs.style.display = 'flex';
                newnavbarContent.style.display = 'none';
                newnextButton.style.display = 'none';
                newbackButton.style.display = 'inline';
            }
            else if (nextClickCount == 0){
                newInsertSongs.style.display = 'none';
                newnavbarContent.style.display = 'flex';
                newnextButton.style.display = 'inline';
                newbackButton.style.display = 'none';
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
            body.style.backgroundImage = 'url(Other_Files/bg-tv.webp)';
            body.style.backgroundColor = '#FFFFFF';
            videoPlayer.style.width =  'auto';
            videoPlayer.style.height = '46.855vh';
            videoPlayer.style.margin = '0 auto';
            videoPlayer.style.marginTop = '2vh';
            ExitTheaterModeButton.style.display ='none';
            TheaterModeFlag = false;
            navbar.style.marginTop = '3vh'
            closeFullscreen();
        }
        else {
            if (nextClickCount == 1){
                S3.style.display = 'flex';
                navbarContent.style.display = 'none';
                nextButton.style.display = 'none';
                backButton.style.display = 'inline';
            }
            else if (nextClickCount == 0){
                S3.style.display = 'none';
                navbarContent.style.display = 'flex';
                nextButton.style.display = 'inline';
                backButton.style.display = 'none';
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
            body.style.backgroundImage = 'url(Other_Files/bg-tv.webp)';
            body.style.backgroundColor = '#FFFFFF';
            videoPlayer.style.width =  'auto';
            videoPlayer.style.height = '46.855vh';
            videoPlayer.style.margin = '0 auto';
            videoPlayer.style.marginTop = '2vh';
            ExitTheaterModeButton.style.display ='none';
            TheaterModeFlag = false;
            navbar.style.marginTop = '3vh'
            closeFullscreen();
        }
    }
})

function togglePlaylist() {
    moveableimg.click();
    if (TheaterModeFlag) {
        newnavbarContent.style.display='none';
        navbarContent.style.display='none';
    }
}

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


const FULL = document.getElementById('STYX_HELIX_FULL');
const FULL_sidebar = document.getElementById('STYX_HELIX_FULL_sidebar')
const OG = document.getElementById('STYX_HELIX_OG')
const OG_sidebar = document.getElementById('STYX_HELIX_OG_sidebar')
const SeasonsEndings = document.getElementsByClassName('Endings--Seasons')

// Switch OP1 - STYX HELIX between cut and full version
function ChangeStyxHelix(){
    keyB++;
        if (keyB%2==1)
        {
            originalIndex = videoUrls.indexOf(`${URL}ED1 - STYX HELIX.mp4`);
            videoUrls[originalIndex] = `${URL}ED1 - STYX HELIX nocut.mp4`;
            OG.style.display = 'none';
            OG_sidebar.style.display = 'none';
            FULL.style.display = 'inline';
            FULL_sidebar.style.display = 'flex';
            for (let i = 0; i < SeasonsEndings.length; i++) {
                SeasonsEndings[i].style.display = 'flex';
            }
            alert("Changed ED1 - STYX HELIX to full version")
        }
        else
        {
            originalIndex = videoUrls.indexOf(`${URL}ED1 - STYX HELIX nocut.mp4`);
            videoUrls[originalIndex] = `${URL}ED1 - STYX HELIX.mp4`;
            OG.style.display = 'inline';
            OG_sidebar.style.display = 'flex';
            FULL.style.display = 'none';
            FULL_sidebar.style.display = 'none';
            for (let i = 0; i < SeasonsEndings.length; i++) {
                SeasonsEndings[i].style.display = 'none';
            }
            alert("Reverted changes to ED1 - STYX HELIX")
        }
    if (TheaterModeFlag)
        setTimeout(Fullscreen,0)
}

// Get current volume from video player before exiting site
window.addEventListener('beforeunload', () => {
    // Save to local storage
    localStorage.setItem('volume', currentVolume.toFixed(2));
    localStorage.setItem('delay', delay.toFixed(3));
    localStorage.setItem('controls', videoPlayer.hasAttribute('controls') ? 'true' : 'false');
});
// Load volume when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have a saved volume
    const savedVolume = localStorage.getItem('volume');
    const savedDelay = localStorage.getItem('delay')
    const savedControls = localStorage.getItem('controls');
    // Apply saved volume if it exists
    if (savedVolume !== null) {
        const volumeNumber = Number (parseFloat(savedVolume).toFixed(2)); // Take only 2 significant digits
        videoPlayer.volume = volumeNumber
        console.log("Setting saved volume:", volumeNumber*100 + "%");
    }

    // Apply saved delay if it exists
    if (savedDelay !== null) {
        const delayNumber = Number (parseFloat(savedDelay).toFixed(3)); // Take only 3 significant digits
        delay = delayNumber;
        console.log("Setting saved delay:", delay/1000 + " seconds")
    }

    // Apply saved controls preference if it exists
    if (savedControls !== null) {
        if (savedControls === 'false') { // Only needs to check for false, default is true
            videoPlayer.removeAttribute('controls');
        }
        console.log("Setting saved controls:", savedControls === 'true' ? "Visible" : "Hidden");
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('Registered Service Worker successfully with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('Failed to register Service Worker: ', error);
        });
    });
}

// Check if we're on Chrome 136 or higher (Chrome 136 is Chrome Dev - this version fixed audio desync)
function isChrome136OrHigher() {
    const userAgent = navigator.userAgent;
    
    // Check if browser is Chrome
    const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
    if (!chromeMatch) return false;
    
    // Extract Chrome version
    const chromeVersion = parseInt(chromeMatch[1], 10);
    
    // Return true if Chrome 136 or higher
    return chromeVersion >= 136;
  }

 // Only handle tab switching, not other visibility changes
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !document.pictureInPictureElement && !isChrome136OrHigher()) {
        setTimeout(() => { 
            videoPlayer.currentTime = videoPlayer.currentTime;
        }, 300)   // Needs delay (300ms) to work reliably + to make user experience better
    }
});

songname.addEventListener('click',function(){
    ChangeStyxHelix();
})

const standaloneMediaQuery = window.matchMedia('(display-mode: standalone)');
const fullscreenMediaQuery = window.matchMedia('(display-mode: fullscreen)');
const minimalUiMediaQuery = window.matchMedia('(display-mode: minimal-ui)');

// Function to check if app is running as installed PWA (checks current state)
function isRunningAsInstalledPWA() {
    // Check standard display modes using the current .matches state
    const isStandalone = standaloneMediaQuery.matches;
    const isFullscreen = fullscreenMediaQuery.matches;
    const isMinimalUi = minimalUiMediaQuery.matches;

    return isStandalone || isFullscreen || isMinimalUi;
}

// Function to handle display mode changes
function handleDisplayModeChange() { 
    // Check if video is paused before changing title
    if (videoPlayer.paused) {
        if (isRunningAsInstalledPWA()) 
            document.title = '';  // Running as PWA
        else 
            document.title = 'Re:Zero Music Collection'; // Running in browser
    }
}

standaloneMediaQuery.addEventListener('change', handleDisplayModeChange);
fullscreenMediaQuery.addEventListener('change', handleDisplayModeChange);
minimalUiMediaQuery.addEventListener('change', handleDisplayModeChange);

// Initial call to check PWA or not
handleDisplayModeChange(isRunningAsInstalledPWA());