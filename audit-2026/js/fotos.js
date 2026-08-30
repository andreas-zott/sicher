// ===== Photos State =====
let photosState = {
    photos: []
};

let editingPhotoId = null;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos();
    renderPhotos();
    setupUploadArea();
    populatePruefpunktSelect();
});

// ===== Load Photos =====
function loadPhotos() {
    const saved = localStorage.getItem('auditState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            photosState.photos = data.photos || [];
        } catch (e) {
            console.error('Failed to load photos:', e);
        }
    }
}

// ===== Save Photos =====
function savePhotosToStorage() {
    const saved = localStorage.getItem('auditState');
    let auditState = {};
    
    if (saved) {
        try {
            auditState = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved state:', e);
        }
    }
    
    auditState.photos = photosState.photos;
    localStorage.setItem('auditState', JSON.stringify(auditState));
}

// ===== Setup Upload Area =====
function setupUploadArea() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Reset input
    });
}

// ===== Handle File Upload =====
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            showToast('Nur Bilddateien sind erlaubt', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showToast('Datei zu gross (max. 10MB)', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const photo = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                dataUrl: e.target.result,
                filename: file.name,
                title: '',
                itemId: '',
                notes: '',
                uploadedAt: new Date().toISOString()
            };
            
            photosState.photos.push(photo);
            savePhotosToStorage();
            renderPhotos();
            showToast('Foto hochgeladen', 'success');
        };
        reader.readAsDataURL(file);
    });
}

// ===== Render Photos =====
function renderPhotos() {
    const gallery = document.getElementById('photo-gallery');
    const noPhotos = document.getElementById('no-photos');
    const photoCount = document.getElementById('photo-count');
    
    if (!gallery) return;
    
    photoCount.textContent = `${photosState.photos.length} Foto${photosState.photos.length !== 1 ? 's' : ''}`;
    
    if (photosState.photos.length === 0) {
        gallery.style.display = 'none';
        noPhotos.style.display = 'block';
        return;
    }
    
    gallery.style.display = 'grid';
    noPhotos.style.display = 'none';
    
    gallery.innerHTML = photosState.photos.map(photo => `
        <div class="photo-card">
            <img src="${photo.dataUrl}" alt="${photo.title || photo.filename}" onclick="openPhotoModal('${photo.id}')" style="cursor: pointer;">
            <div class="photo-info">
                <h4>${photo.title || photo.filename}</h4>
                <p>${photo.itemId ? `Pruefpunkt: ${photo.itemId}` : 'Kein Pruefpunkt zugeordnet'}</p>
                <p>${formatDateTime(photo.uploadedAt)}</p>
            </div>
            <div class="photo-actions">
                <button class="btn-secondary btn-small" onclick="openPhotoModal('${photo.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    Bearbeiten
                </button>
                <button class="btn-secondary btn-small btn-danger" onclick="deletePhoto('${photo.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== Populate Pruefpunkt Select =====
function populatePruefpunktSelect() {
    const select = document.getElementById('photo-item');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Kein Pruefpunkt --</option>';
    
    AUDIT_CATEGORIES.forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category.name;
        
        category.items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.id}: ${item.text.substring(0, 50)}...`;
            optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
    });
}

// ===== Modal Functions =====
function openPhotoModal(id) {
    const photo = photosState.photos.find(p => p.id === id);
    if (!photo) return;
    
    editingPhotoId = id;
    document.getElementById('modal-photo').src = photo.dataUrl;
    document.getElementById('photo-id').value = id;
    document.getElementById('photo-title').value = photo.title || '';
    document.getElementById('photo-item').value = photo.itemId || '';
    document.getElementById('photo-notes').value = photo.notes || '';
    document.getElementById('photo-modal').style.display = 'flex';
}

function closePhotoModal() {
    document.getElementById('photo-modal').style.display = 'none';
    editingPhotoId = null;
}

function savePhotoDetails() {
    const photo = photosState.photos.find(p => p.id === editingPhotoId);
    if (!photo) return;
    
    photo.title = document.getElementById('photo-title').value.trim();
    photo.itemId = document.getElementById('photo-item').value;
    photo.notes = document.getElementById('photo-notes').value.trim();
    
    savePhotosToStorage();
    renderPhotos();
    closePhotoModal();
    showToast('Foto aktualisiert', 'success');
}

// ===== Delete Functions =====
function deletePhoto(id) {
    if (!confirm('Moechten Sie dieses Foto wirklich loeschen?')) return;
    
    photosState.photos = photosState.photos.filter(p => p.id !== id);
    savePhotosToStorage();
    renderPhotos();
    showToast('Foto geloescht', 'success');
}

function clearAllPhotos() {
    if (!confirm('Moechten Sie wirklich alle Fotos loeschen?')) return;
    
    photosState.photos = [];
    savePhotosToStorage();
    renderPhotos();
    showToast('Alle Fotos geloescht', 'success');
}

// ===== Helper Functions =====
function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE') + ' ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${type === 'success' 
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                : '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>'
            }
        </svg>
        ${message}
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
