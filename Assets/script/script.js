console.log ("To disable preloading, you can click the image below the video player. To re-enable preloading, you can click my trademark text.")
console.log("Pressing Play on video ending will restart the current video (not a bug, it's a feature)")
console.log("Video player keyboard controls: Spacebar: Play/Pause video; ArrowKeyRight: Skipping to next video; ArrowKeyRight: Returning to previous video; Numpad1/Digit1 for video selecting; Tab to change between OPs and EDs and Insert Songs.")
console.log("Q,W,E,R: For respective buttons (left to right). Press F for Fullscreen toggling. Press T for Theater Mode toggling")
var videoUrls = [
    "Openings_and_Endings/OP1 - Redo.mp4",
    "Openings_and_Endings/ED1 - STYX HELIX.mp4",
    "Openings_and_Endings/OP2 - Paradisus - Paradoxum.mp4",
    "Openings_and_Endings/ED2 - Stay Alive.mp4",
    "Openings_and_Endings/OP3 - Realize.mp4",
    "Openings_and_Endings/ED3 - Memento.mp4",
    "Openings_and_Endings/OP4 - Long shot.mp4",
    "Openings_and_Endings/ED4 - Believe in you.mp4",
    "Openings_and_Endings/OP5 - Reweave.mp4",
    "Openings_and_Endings/ED5 - Nox Lux.mp4",
];
var newvideoUrls = [
    "Insert_Songs/STRAIGHT BET.mp4",
    "Insert_Songs/Memories.mp4",
    "Insert_Songs/White White Snow.mp4",
    "Insert_Songs/Yuki no hate ni Kimi no na wo.mp4",
    "Insert_Songs/Wishing.mp4",
    "Insert_Songs/Door.mp4",
    "Insert_Songs/What you dont know.mp4",
];
    
let isPosterSet = false; //Track if poster is set
let currentIndex = 0; // For videoUrls
let newcurrentIndex =0; // For newvideoUrls
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

function playVideo(videoName) {
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
})
// Automatically play next video after ending with a delay
function playNextVideo() {
    if (!isSwitching) {
        isSwitching = true;
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
const S3 = document.getElementById('Season3Content');
const SidebarButton = document.getElementById('SidebarButton');

moveableimg.addEventListener('click', function(){
        
    if (isAnimating || this.hasAttribute('disabled')) {
    return; // Exit the function if an animation is already in progress or the element is disabled
    }
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    clickCount++;
    console.log("Image clicked!"); // Add this line for testing
    if (clickCount % 2 === 1) {
        textToChange.innerHTML = "All <s> OPs and EDs</s> Insert Songs";
        bodytext.innerHTML = "Insert Songs and more!"
        songname.innerHTML = "Openings and Endings"
        navbarContent.style.display = 'none';
        newnavbarContent.style.display ='block';
        videoPlayer.src= newvideoUrls[0];
        newcurrentIndex=0;
        clearTimeout(nextVideoTimeout);
        isSwitching = false; 
        textToChange.classList.add('fade-in-title');
        bodytext.classList.add('fade-in-bodytext');
        songname.classList.add('fade-in-songname');
        newnavbarContent.classList.add('slide-in');
        moveableimg.classList.add('fade-in');
        backButton.style.display ='none';
        nextButton.style.display ='none';
        S3.style.display='none';
        Insert_Songs.style.display = '';
        Endings.style.display = 'none';
        Openings.style.display = 'none';
        Openings_Content.style.display = 'none';
        Endings_Content.style.display = 'none';
        Insert_Songs_Content.style.display = '';
        SidebarButton.innerHTML = "Change to OPs and EDs";
    }
    else {
        textToChange.innerHTML = " All OPs and EDs ";
        bodytext.innerHTML = "Openings and Endings!";
        songname.innerHTML = "Insert Songs"
        navbarContent.style.display ='block';
        newnavbarContent.style.display ='none';
        videoPlayer.src=videoUrls[0];
        currentIndex=0;
        clearTimeout(nextVideoTimeout); 
        isSwitching = false; 
        textToChange.classList.add('fade-in-title');
        bodytext.classList.add('fade-in-bodytext');
        songname.classList.add('fade-in-songname');
        navbarContent.classList.add('slide-in');
        moveableimg.classList.add('fade-in');
        nextButton.style.display ='inline';
        nextButton.classList.add('fade-in-songname')
        Insert_Songs.style.display='none';
        Openings.style.display = '';
        Endings.style.display = '';
        Openings_Content.style.display = '';
        Endings_Content.style.display = '';
        Insert_Songs_Content.style.display = 'none';
        SidebarButton.innerHTML = "Change to Insert Songs";
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
});
newnavbarContent.addEventListener('animationend', () => {
newnavbarContent.classList.remove('slide-in');
});
moveable_img.addEventListener('animationend', () => {
moveable_img.classList.remove('fade-in');
});
nextButton.addEventListener('animationend', () => {
nextButton.classList.remove('fade-in-songname');
});

function handleFontSizeChange(mediaQuery) {
    // Change font size for mobile devices
    if (mediaQuery.matches) {
        textToChange.style.fontSize = '4.2vw';
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

// Video preloading 
videoPlayer.addEventListener('timeupdate', function() {
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;
    if (duration - currentTime <= 5 && !disablePreloading) {

    // Preload multiple videos based on the current video type
        if (clickCount % 2 === 1) {
            const nextNewIndex = (newcurrentIndex + 1) % newvideoUrls.length;
            if (!preloadedVideos.includes(newvideoUrls[nextNewIndex])) {
                const nextNewVideo = document.createElement('video');
                nextNewVideo.src = newvideoUrls[nextNewIndex];
                nextNewVideo.preload = 'auto';
                preloadedVideos.push(newvideoUrls[nextNewIndex]);
                console.log('Next new video preloaded:', newvideoUrls[nextNewIndex]);                                      
            }
        }
        else {
            const nextIndex = (currentIndex + 1) % videoUrls.length;
            if (!preloadedVideos.includes(videoUrls[nextIndex])) {
                const nextVideo = document.createElement('video');
                nextVideo.src = videoUrls[nextIndex];
                nextVideo.preload = 'auto';
                preloadedVideos.push(videoUrls[nextIndex]);
                console.log('Next video preloaded:', videoUrls[nextIndex]);  
            }
        }
    }      
});

// Reset preloadedVideos array every 60 seconds (worst case scenario) to optimize playback.
function ResetArray(){
    preloadedVideos = [];
}
videoPlayer.addEventListener('ended',ResetArray)

// Enable and Disable Looping functions
enableLoopingListener = function EnableLooping() {
    if (clickCount % 2 == 1) {
        loopcurrentIndex = newcurrentIndex;
        videoPlayer.src = newvideoUrls[loopcurrentIndex];
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
        if (clickCount % 2 == 1){ 
            const songName = newvideoUrls[newcurrentIndex].split('/').pop(); // Get the last part of the path after splitting by '/'   
            console.log('Video looping enabled for:', songName);
            alert("Video looping enabled for: " + songName);
        }
        else {
            const songName = videoUrls[currentIndex].split('/').pop();
            console.log('Video looping enabled for:', songName);
            alert("Video looping enabled for: " + songName);   
        }
    }
    else {
        loopText.innerHTML = "Enable looping";
        videoPlayer.removeEventListener('ended', enableLoopingListener);
        videoPlayer.addEventListener('ended',ResetArray);
        if (clickCount % 2 == 1){
            const songName = newvideoUrls[newcurrentIndex].split('/').pop();
            console.log('Video looping disabled for:', songName)
            alert("Video looping disabled for: " + songName);
        }
        else {
            const songName = videoUrls[currentIndex].split('/').pop();
            console.log('Video looping disabled for:', songName);
            alert("Video looping disabled for: " + songName);
        }
    }
});

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
    if (clickCount % 2 == 1)
        console.log('Shuffled videos to:', newvideoUrls);
    else
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

// Check for orientation change using matchMedia (for mobile devices)
const checkOrientation = () => {
    if (window.matchMedia("(max-width: 722px) and (orientation: landscape)").matches) {
        alert("Please switch to portrait mode for the best experience.");
    }
};
// Listen for orientation changes
window.addEventListener("resize", checkOrientation);

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
        if (clickCount % 2 === 1) {
            const nextnewcurrentIndex = (newcurrentIndex + 1) % newvideoUrls.length;
            playVideo(newvideoUrls[nextnewcurrentIndex]);
        }
        else {
            const nextcurrentIndex = (currentIndex + 1) % videoUrls.length;
            playVideo(videoUrls[nextcurrentIndex]);
        }
    }
    // Returning to the previous video using the playVideo function (doesn't work if used on first video)
    if (event.code === "ArrowLeft") {
        if (clickCount % 2 === 1) {
            if (newcurrentIndex > 0) {
                prevnewIndex = newcurrentIndex - 1;
                playVideo(newvideoUrls[prevnewIndex]);
            }
        }   
        else {
            if (currentIndex > 0) {
                prevIndex = currentIndex - 1;
                playVideo(videoUrls[prevIndex]);
            }
        }
    }
    if (event.code === "Numpad1"||event.code === "Digit1")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[0]);
        }   
        else {
            playVideo(videoUrls[0]);
        }
    }
    if (event.code === "Numpad2"||event.code === "Digit2")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[1]);
        }   
        else {
           playVideo(videoUrls[1]);
            }
    }
    if (event.code === "Numpad3"||event.code === "Digit3")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[2]);
        }   
        else {
            playVideo(videoUrls[2]);
        }
    }
    if (event.code === "Numpad4"||event.code === "Digit4")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[3]);
        }   
        else {
            playVideo(videoUrls[3]);
        }
    }
    if (event.code === "Numpad5"||event.code === "Digit5")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[4]);
        }   
        else {
            playVideo(videoUrls[4]);
        }
    }
    if (event.code === "Numpad6"||event.code === "Digit6")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[5]);
        }   
        else {
            playVideo(videoUrls[5]);
        }
    }
    if (event.code === "Numpad7"||event.code === "Digit7")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[6]);
        }   
        else {
            playVideo(videoUrls[6]);
            }
    }
    if (event.code === "Numpad8"||event.code === "Digit8")  {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[7]);
        }   
    }
    if (event.code === 'Numpad9'||event.code === "Digit9") {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[8]);
        }   
    }
    if (event.code === 'Numpad0'||event.code === "Digit0") {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[9]);
        }   
    }
    if (event.code === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior
        moveableimg.click();
        if (TheaterModeFlag){
            newnavbarContent.style.display='none';
            navbarContent.style.display='none';
        }
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
});
    
let isAnimatingbutton = false;
// Next and Back button implementation:
nextButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    navbarContent.style.display = 'none';
    S3.style.display = 'block';
    nextButton.style.display ='none';
    backButton.style.display ='inline';
    S3.classList.add('fade-in');
    backButton.classList.add('fade-in');
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        }, 2501);
})
backButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    navbarContent.style.display = 'block';
    S3.style.display = 'none';
    nextButton.style.display ='inline';
    backButton.style.display ='none';
    navbarContent.classList.add('fade-in');
    nextButton.classList.add('fade-in');
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        }, 2501);
})
S3.addEventListener('animationend', () => {
    S3.classList.remove('fade-in');
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
const body = document.getElementById('body');
const ReZeroCast = document.getElementById('subaru');
const Trademark = document.getElementById('trademark');
const GitHub = document.getElementById('github');
let TheaterModeFlag = false;
let TheaterModeClickCount = 0;
const ExitTheaterModeButton = document.getElementById('ExitTheaterModeButton');
const KeyboardControls = document.getElementById("KeyboardControls")

TheaterMode.addEventListener('click',function() {
    TheaterModeClickCount++;
    if (TheaterModeClickCount%2==1){
        navbarContent.style.display = 'none';
        newnavbarContent.style.display = 'none';
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
        videoPlayer.style.marginTop = '4vh';
        videoPlayer.style.marginBottom = '5vh';
        body.style.backgroundColor = '#000000';
        body.style.backgroundImage = 'none';
        document.documentElement.requestFullscreen();
        TheaterModeFlag = true;
        ExitTheaterModeButton.style.display ='flex';
    }
    else
        if (clickCount%2==1){
            newnavbarContent.style.display = 'block';
            paragraph.style.display = 'block';
            ReZeroCast.style.display = 'block';
            Trademark.style.display = 'block';
            GitHub.style.display = 'none';
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
            ExitTheaterModeButton.style.display ='none';
            TheaterModeFlag = false;
            closeFullscreen();
        }
        else {
            navbarContent.style.display = 'block';
            paragraph.style.display = 'block';
            ReZeroCast.style.display = 'block';
            Trademark.style.display = 'block';
            GitHub.style.display = 'none';
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
            ExitTheaterModeButton.style.display ='none';
            TheaterModeFlag = false;
            closeFullscreen();
        }

})
function ChangeToInsertSongs() {
        moveableimg.click();
        if (TheaterModeFlag==true) {
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
