// Modal interaction functions
let currentEditingPlaylist = '';
let tempPlaylistSongs = [];

function loadPlaylist(playlistName) {
    // Handle "All Songs" special case
    if (playlistName === 'default') {
        // Reset to original arrays - combine both videoUrls and newvideoUrls
        var originalVideoUrls = [
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
        var originalNewVideoUrls = [
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
        
        videoUrls = originalVideoUrls;
        newvideoUrls = originalNewVideoUrls;
        if (window.clickCount % 2 === 1) 
            playVideo(newvideoUrls[0]);
        else
            playVideo(videoUrls[0]);
        showToast(`Reset playlists to default.`)
        return;
    }

    // Get playlist from localStorage
    let playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    let playlist = playlists[playlistName];
    
    if (playlist && playlist.songs) {
        // BOOM: Just replace the entire array
         if (window.clickCount % 2 === 1) {
            newvideoUrls = playlist.songs.map(songName => convertToUrl(songName));
            playVideo(newvideoUrls[0]); 
        }
        else {
            videoUrls = playlist.songs.map(songName => convertToUrl(songName));
            playVideo(videoUrls[0]);
        }
        showToast(`Loaded playlist: "${playlistName}" with ${playlist.songs.length} songs.`);
    }
}

// Replace lines ~47-52 with:
function convertToUrl(songName) {
    // Find song in master list
    const song = MASTER_SONGS.find(s => s.title === songName);
    if (song) {
        return `${URL}${song.filename}`;
    }
    
    // Fallback to old logic
    if (songName === "ED2 - Stay Alive" || songName === "ED4 - Believe in you" || songName === "S1 Ending")
        return `${URL}${songName}.webm`
    return `${URL}${songName}.mp4`;
}


function populateSidebarPlaylists() {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    const container = document.getElementById('dynamic-playlists');
    
    container.innerHTML = ''; // Clear existing
    
    Object.keys(playlists).forEach(playlistName => {
        const playlist = playlists[playlistName];
        
        // Skip empty playlists
        if (!playlist.songs || playlist.songs.length === 0) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="flex space-y-1 items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-blue-100">
                <div onclick="loadPlaylist('${playlistName}')" class="flex-1 text-left">
                    ${playlistName} (${playlists[playlistName].songs.length} songs)
                </div>
                <div class="flex gap-1">
                    <button onclick="editPlaylist('${playlistName}')" class="text-blue-500 hover:text-blue-700" title="Edit">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </button>
                    <button onclick="deletePlaylist('${playlistName}')" class="text-red-500 hover:text-red-700" title="Delete">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(li);
    });
    
}

function createNewPlaylist() {
    const name = prompt('Playlist name:');
    if (name && name.trim()) {
        const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
        playlists[name.trim()] = {
            songs: [],
            created: new Date().toISOString(),
            description: ''
        };
        localStorage.setItem('playlists', JSON.stringify(playlists));
        populateSidebarPlaylists();
        showToast(`Created playlist: "${name}" successfully!`, 'success');
        
        // Open playlist editor
        editPlaylist(name.trim());
    }
}

function deletePlaylist(name) {
    if (confirm(`Xóa danh sách "${name}"?`)) {
        const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
        delete playlists[name];
        showToast(`Deleted playlist: "${name}" successfully!`, 'success');
        localStorage.setItem('playlists', JSON.stringify(playlists));
        populateSidebarPlaylists();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    populateSidebarPlaylists();
});

function editPlaylist(playlistName) {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    const playlist = playlists[playlistName];
    
    currentEditingPlaylist = playlistName;
    tempPlaylistSongs = [...playlist.songs]; 

    window.isEditingPlaylist = true; // Set editing mode

    if (!playlist) return;
    
    // Create modal dynamically
    const modal = createPlaylistEditorModal(playlistName, playlist);
    document.body.appendChild(modal);
    
    // Show modal with fade-in effect
    setTimeout(() => modal.style.opacity = '1', 10);
}

function createPlaylistEditorModal(playlistName, playlist) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300';
    modal.style.opacity = '0';
    modal.id = 'playlist-editor-modal';
    
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div class="flex justify-between items-center mb-6 flex-shrink-0">
                <div class="flex-1 mr-4">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Editing playlist</h2>
                    <div class="flex items-center gap-2">
                        <!-- Default view - just display name -->
                        <div id="playlist-name-display" class="flex items-center gap-2">
                            <span class="text-base font-medium text-gray-800 dark:text-gray-200">${playlistName}</span>
                            <button onclick="startEditingName()" class="text-gray-500 hover:text-blue-500 transition-colors" title="Rename">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Edit view - input field (hidden by default) -->
                        <div id="playlist-name-edit" class="flex items-center gap-2" style="display: none;">
                            <input type="text" 
                                id="playlist-name-input" 
                                value="${playlistName}" 
                                class="text-base font-medium bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:border-blue-500 focus:outline-none text-gray-800 dark:text-gray-200 min-w-0 max-w-xs"
                                placeholder="Tên danh sách phát">
                            <button onclick="saveNameEdit()" class="text-green-500 hover:text-green-700" title="Lưu">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                            <button onclick="cancelNameEdit()" class="text-red-500 hover:text-red-700" title="Hủy">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full" id="song-count-display">
                            ${playlist.songs.length} songs
                        </span>
                    </div>
                </div>
                <button onclick="closePlaylistEditor()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <!-- Available Songs -->
                <div class="flex flex-col min-h-0">
                    <div class="flex items-center justify-between mb-4 flex-shrink-0">
                        <input type="text" id="song-search" placeholder="Search songs..." 
                            class="px-3 py-1 border rounded text-sm w-48 dark:bg-gray-700 dark:border-gray-600" 
                            oninput="filterAvailableSongs()">
                    </div>
                    <div id="available-songs" class="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 overflow-y-auto playlist-container-height">
                        ${generateAvailableSongsList(tempPlaylistSongs)}
                    </div>
                </div>
                
                <!-- Current Playlist -->
                <div class="flex flex-col min-h-0">
                    <div class="flex items-center justify-between mb-6 flex-shrink-0">
                        <button onclick="clearPlaylist('${playlistName}')" class="text-red-500 hover:text-red-700 text-sm">
                            Xóa tất cả
                        </button>
                    </div>
                    <div id="current-playlist" class="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 overflow-y-auto playlist-container-height">
                        ${generateCurrentPlaylistList(tempPlaylistSongs)}
                    </div>
                </div>
            </div>
            
            <div class="flex justify-between items-center mt-6 flex-shrink-0">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop to rearrange order • Double click to add/remove a song
                </div>
                <div class="flex gap-3">
                    <button onclick="closePlaylistEditor()" class="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
                        Cancel
                    </button>
                    <button onclick="savePlaylist()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePlaylistEditor();
    });
    
    return modal;
}

function clearPlaylist(playlistName) {
    if (confirm(`Delete all songs from "${playlistName}"?`)) {
        tempPlaylistSongs = [];
        refreshModalContent();
    }
}


function saveNameEdit() {
    const input = document.getElementById('playlist-name-input');
    const newName = input.value.trim();
    
    if (!newName) {
        showToast('Playlist name must not be blank', 'error');
        return;
    }
    
    // Update display
    const displaySpan = document.querySelector('#playlist-name-display span');
    displaySpan.textContent = newName;
    
    // Visual feedback
    displaySpan.style.color = '#10b981';
    setTimeout(() => {
        displaySpan.style.color = '';
    }, 1000);
    
    // Hide edit mode
    cancelNameEdit();
    
    showToast('Playlist name has been changed. Press "Save Changes" to save your changes!', 'info');
}


function getCurrentPlaylistName() {
    // Check if we're in edit mode
    const editDiv = document.getElementById('playlist-name-edit');
    if (editDiv && editDiv.style.display !== 'none') {
        const input = document.getElementById('playlist-name-input');
        return input ? input.value.trim() : currentEditingPlaylist;
    }
    
    // Otherwise get from display
    const displaySpan = document.querySelector('#playlist-name-display span');
    return displaySpan ? displaySpan.textContent.trim() : currentEditingPlaylist;
}

function startEditingName() {
    const displayDiv = document.getElementById('playlist-name-display');
    const editDiv = document.getElementById('playlist-name-edit');
    const input = document.getElementById('playlist-name-input');
    
    displayDiv.style.display = 'none';
    editDiv.style.display = 'flex';
    
    // Focus input and select text
    setTimeout(() => {
        input.focus();
        input.select();
        
        // Add keyboard listeners
        input.addEventListener('keydown', handleNameEditKeydown);
    }, 100);
}

function handleNameEditKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveNameEdit();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        cancelNameEdit();
    }
}

function cancelNameEdit() {
    const displayDiv = document.getElementById('playlist-name-display');
    const editDiv = document.getElementById('playlist-name-edit');
    const input = document.getElementById('playlist-name-input');
    
    // Remove keyboard listeners
    input.removeEventListener('keydown', handleNameEditKeydown);
    
    // Reset input to original value
    input.value = currentEditingPlaylist;
    
    editDiv.style.display = 'none';
    displayDiv.style.display = 'flex';
}


let draggedIndex = null;

function dragStart(event, index) {
    draggedIndex = index;
    event.dataTransfer.effectAllowed = 'move';
    event.target.style.opacity = '0.5';
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function dragDrop(event, targetIndex) {
    event.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
        // Reorder the tempPlaylistSongs array
        const draggedSong = tempPlaylistSongs[draggedIndex];
        tempPlaylistSongs.splice(draggedIndex, 1);
        tempPlaylistSongs.splice(targetIndex, 0, draggedSong);
        
        refreshModalContent();
    }
    
    // Reset dragged state
    draggedIndex = null;
    event.target.style.opacity = '1';
}

function dragEnd(event) {
    event.target.style.opacity = '1';
    draggedIndex = null;
}

function filterAvailableSongs() {
    const searchTerm = document.getElementById('song-search').value.toLowerCase();
    const availableContainer = document.getElementById('available-songs');
    const songElements = availableContainer.querySelectorAll('[data-song-title]'); // Changed from [data-song]
    
    songElements.forEach(element => {
        const songName = element.getAttribute('data-song-title').toLowerCase(); // Changed from data-song
        if (songName.includes(searchTerm)) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

function generateAvailableSongsList(currentSongs) {
    const availableSongs = MASTER_SONGS.filter(song => 
        !currentSongs.includes(song.title)
    );
    
    if (availableSongs.length === 0) {
        return `
            <div class="text-center text-gray-500 py-8">
                <div class="font-medium">All songs have been added!</div>
                <div class="text-sm mt-1">Playlist is full!</div>
            </div>
        `;
    }
    
    return availableSongs.map((song, index) => `
        <div class="flex items-center justify-between p-2 rounded hover:bg-white dark:hover:bg-gray-600 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-500" 
            ondblclick="addSongFromDataAttr(this)" 
            data-song-title="${song.title}"
            data-song-index="${index}">
            <div class="flex items-center">
                <span class="text-sm font-medium">${song.title}</span>
                <span class="ml-2 px-2 py-1 text-xs rounded-full ${getTypeColor(song.type)}">
                    ${song.type.toUpperCase()}
                </span>
            </div>
            <button onclick="addSongFromDataAttr(this.parentElement)" 
                    class="text-green-500 hover:text-green-700" title="Add">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function addSongFromDataAttr(element) {
    const songTitle = element.getAttribute('data-song-title');
    addSongToCurrentPlaylist(songTitle);
}

function removeSongFromDataAttr(element) {
    const songTitle = element.getAttribute('data-song-title');
    removeSongFromCurrentPlaylist(songTitle);
}


function getTypeColor(type) {
    switch(type) {
        case 'opening': return 'bg-blue-100 text-blue-800';
        case 'ending': return 'bg-green-100 text-green-800';
        case 'insert song': return 'bg-purple-100 text-purple-800';
        case 'special': return 'bg-yellow-100 text-yellow-800';
        case 'live concert': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function generateCurrentPlaylistList(songs) {
    if (songs.length === 0) {
        return '<div class="text-center text-gray-500 dark:text-gray-400 py-8">Danh sách trống<br><small>Thêm bài hát từ cột bên trái</small></div>';
    }
    
    return songs.map((song, index) => `
        <div class="flex items-center justify-between p-3 rounded bg-white dark:bg-gray-600 border dark:border-gray-500 mb-2 cursor-move" 
             draggable="true" 
             ondragstart="dragStart(event, ${index})" 
             ondragover="dragOver(event)" 
             ondrop="dragDrop(event, ${index})"
             ondragend="dragEnd(event)"
             ondblclick="removeSongFromDataAttr(this)"
             data-song-title="${song}">
            <div class="flex items-center">
                <span class="text-gray-400 mr-3 font-mono text-sm">${(index + 1).toString().padStart(2, '0')}</span>
                <span class="font-medium">${song}</span>
            </div>
            <button onclick="removeSongFromDataAttr(this.parentElement)" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function getAllAvailableSongs() {
    return MASTER_SONGS.map(song => song.title);
}

// Keep your old function as backup
function getAllAvailableSongsLegacy() {
    const allSongs = [];
    const allUrls = [...videoUrls, ...newvideoUrls];
    allUrls.forEach(url => {
        const songName = cleanVideoSrcName(url);
        if (!allSongs.includes(songName)) {
            allSongs.push(songName);
        }
    });
    return allSongs.sort();
}


function addSongToCurrentPlaylist(songName) {
    if (!tempPlaylistSongs.includes(songName)) {
        tempPlaylistSongs.push(songName);
        refreshModalContent();
    }
}

function removeSongFromCurrentPlaylist(songName) {
    tempPlaylistSongs = tempPlaylistSongs.filter(song => song !== songName);
    refreshModalContent();
}

// Replace your current refreshModalContent function with this improved version:
function refreshModalContent() {
    const availableContainer = document.getElementById('available-songs');
    const currentContainer = document.getElementById('current-playlist');
    const searchInput = document.getElementById('song-search');
    
    if (availableContainer && currentContainer) {
        // Save current search term
        const currentSearchTerm = searchInput ? searchInput.value : '';
        
        // Update content
        availableContainer.innerHTML = generateAvailableSongsList(tempPlaylistSongs);
        currentContainer.innerHTML = generateCurrentPlaylistList(tempPlaylistSongs);
        
        // Restore search term and apply filter
        if (currentSearchTerm && searchInput) {
            searchInput.value = currentSearchTerm;
            filterAvailableSongs(); // Reapply the filter
        }
        
        // Update song count in header
        const songCountDisplay = document.getElementById('song-count-display');
        if (songCountDisplay) {
            songCountDisplay.textContent = `${tempPlaylistSongs.length} bài`;
        }
        
        // Update save button state
        const saveButton = document.querySelector('button[onclick*="savePlaylist"]');
        if (saveButton) {
            if (tempPlaylistSongs.length === 0) {
                saveButton.disabled = true;
                saveButton.className = saveButton.className.replace('bg-blue-500', 'bg-gray-400');
                saveButton.className = saveButton.className.replace('hover:bg-blue-600', 'cursor-not-allowed');
            } else {
                saveButton.disabled = false;
                saveButton.className = saveButton.className.replace('bg-gray-400', 'bg-blue-500');
                saveButton.className = saveButton.className.replace('cursor-not-allowed', 'hover:bg-blue-600');
            }
        }
    }
}

function closePlaylistEditor() {
    const modal = document.getElementById('playlist-editor-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove()
            window.isEditingPlaylist = false;
        },300);
    }
}

function savePlaylist() {
    const newPlaylistName = getCurrentPlaylistName();
    const oldPlaylistName = currentEditingPlaylist;
    
    // Validate name
    if (!newPlaylistName) {
        showToast('Playlist name must not be blank!', 'error');
        return;
    }
    
    // Check if playlist is empty
    if (tempPlaylistSongs.length === 0) {
        const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
        delete playlists[oldPlaylistName];
        localStorage.setItem('playlists', JSON.stringify(playlists));
        
        closePlaylistEditor();
        populateSidebarPlaylists();
        showToast(`Deleted empty playlist: "${oldPlaylistName}"`, 'warning');
        return;
    }
    
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    
    // Handle name change
    if (newPlaylistName !== oldPlaylistName) {
        // Check if new name already exists
        if (playlists[newPlaylistName]) {
            showToast(`Playlist: "${newPlaylistName}" already existed!`, 'error');
            return;
        }
        
        // Create new playlist with new name
        playlists[newPlaylistName] = {
            songs: [...tempPlaylistSongs],
            created: playlists[oldPlaylistName].created,
            description: playlists[oldPlaylistName].description || '',
            modified: new Date().toISOString()
        };
        
        // Delete old playlist
        delete playlists[oldPlaylistName];
        
        showToast(`Changed Playlist name from "${oldPlaylistName}" to "${newPlaylistName}" and successfully saved!`);
    } else {
        // Just update songs
        playlists[newPlaylistName].songs = [...tempPlaylistSongs];
        playlists[newPlaylistName].modified = new Date().toISOString();
        
        showToast(`Successfully saved playlist: "${newPlaylistName}"`);
    }
    
    localStorage.setItem('playlists', JSON.stringify(playlists));
    
    populateSidebarPlaylists();
    closePlaylistEditor();
}