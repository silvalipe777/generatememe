// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// State
let currentPage = 1;
let currentSort = 'recent';
let isLoading = false;

// DOM Elements
const generateBtn = document.getElementById('generate-btn');
const memePromptInput = document.getElementById('meme-prompt');
const authorNameInput = document.getElementById('author-name');
const statusDiv = document.getElementById('generation-status');
const memesGrid = document.getElementById('memes-grid');
const hallOfFameGrid = document.getElementById('hall-of-fame-grid');
const loadMoreBtn = document.getElementById('load-more');
const visitorsCount = document.getElementById('visitors-count');
const memesCountEl = document.getElementById('memes-count');
const memeModal = document.getElementById('meme-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadMemes();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Generate meme
    generateBtn.addEventListener('click', generateMeme);

    // Enter key on prompt input
    memePromptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateMeme();
        }
    });

    // Sort buttons
    document.querySelectorAll('[data-sort]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentSort = e.target.dataset.sort;
            currentPage = 1;
            memesGrid.innerHTML = '';
            loadMemes();

            // Update active state
            document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Load more
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        loadMemes();
    });

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            navigateToSection(target);

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Modal close
    modalClose.addEventListener('click', () => {
        memeModal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === memeModal) {
            memeModal.classList.remove('show');
        }
    });
}

// Navigate to section
function navigateToSection(section) {
    document.querySelectorAll('section').forEach(s => {
        s.style.display = 'none';
    });

    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    if (section === 'hall-of-fame') {
        loadHallOfFame();
    } else if (section === 'feed') {
        if (memesGrid.children.length === 0) {
            loadMemes();
        }
    }
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/memes/stats/info`);
        const data = await response.json();

        visitorsCount.textContent = data.totalVisitors.toLocaleString();
        memesCountEl.textContent = data.totalMemes.toLocaleString();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Generate Meme
async function generateMeme() {
    const prompt = memePromptInput.value.trim();

    if (!prompt) {
        showStatus('Please enter a meme idea!', 'error');
        return;
    }

    if (isLoading) return;
    isLoading = true;

    // Update button state
    generateBtn.disabled = true;
    generateBtn.querySelector('.btn-text').style.display = 'none';
    generateBtn.querySelector('.btn-loader').style.display = 'inline';

    showStatus('Generating your meme... This may take 10-30 seconds.', 'info');

    try {
        const response = await fetch(`${API_BASE_URL}/memes/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                author: authorNameInput.value.trim() || 'Anon'
            })
        });

        const data = await response.json();

        if (data.success) {
            showStatus('Meme created successfully!', 'success');
            memePromptInput.value = '';
            authorNameInput.value = '';

            // Reload feed
            currentPage = 1;
            memesGrid.innerHTML = '';
            await loadMemes();
            await loadStats();

            // Scroll to feed
            document.getElementById('feed').scrollIntoView({ behavior: 'smooth' });
        } else {
            showStatus(data.error || 'Failed to generate meme', 'error');
        }
    } catch (error) {
        console.error('Error generating meme:', error);
        showStatus('Error generating meme. Please try again.', 'error');
    } finally {
        isLoading = false;
        generateBtn.disabled = false;
        generateBtn.querySelector('.btn-text').style.display = 'inline';
        generateBtn.querySelector('.btn-loader').style.display = 'none';
    }
}

// Load Memes
async function loadMemes() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/memes?page=${currentPage}&limit=20&sort=${currentSort}`
        );
        const data = await response.json();

        if (data.memes && data.memes.length > 0) {
            data.memes.forEach(meme => {
                const memeCard = createMemeCard(meme);
                memesGrid.appendChild(memeCard);
            });

            // Show/hide load more button
            if (currentPage >= data.totalPages) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        } else {
            if (currentPage === 1) {
                memesGrid.innerHTML = '<p class="text-center">No memes yet. Be the first to create one!</p>';
            }
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading memes:', error);
        showStatus('Error loading memes', 'error');
    }
}

// Load Hall of Fame
async function loadHallOfFame() {
    try {
        hallOfFameGrid.innerHTML = '<p class="loading">Loading top memes...</p>';

        const response = await fetch(`${API_BASE_URL}/memes/hall-of-fame`);
        const data = await response.json();

        hallOfFameGrid.innerHTML = '';

        if (data.memes && data.memes.length > 0) {
            data.memes.forEach((meme, index) => {
                const memeCard = createMemeCard(meme, index + 1);
                hallOfFameGrid.appendChild(memeCard);
            });
        } else {
            hallOfFameGrid.innerHTML = '<p class="text-center">No memes in hall of fame yet!</p>';
        }
    } catch (error) {
        console.error('Error loading hall of fame:', error);
        hallOfFameGrid.innerHTML = '<p class="text-center">Error loading hall of fame</p>';
    }
}

// Create Meme Card
function createMemeCard(meme, rank = null) {
    const card = document.createElement('div');
    card.className = 'meme-card';
    card.dataset.memeId = meme._id;

    const rankBadge = rank ? `<div style="position: absolute; top: 10px; left: 10px; background: gold; color: black; padding: 5px 10px; border-radius: 5px; font-weight: bold; z-index: 10;">#${rank}</div>` : '';

    card.innerHTML = `
        ${rankBadge}
        <div class="meme-image-container">
            <img src="${meme.imageUrl}" alt="${meme.caption}" class="meme-image" loading="lazy">
        </div>
        <div class="meme-content">
            <p class="meme-caption">${escapeHtml(meme.caption)}</p>
            <div class="meme-meta">
                <span class="meme-author">by ${escapeHtml(meme.author)}</span>
                <div class="meme-stats">
                    <div class="stat">
                        <button class="like-btn" data-meme-id="${meme._id}">❤️</button>
                        <span>${meme.likes}</span>
                    </div>
                    <div class="stat">
                        👁️ <span>${meme.views}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Click to view full size
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('like-btn')) {
            showMemeModal(meme);
            incrementView(meme._id);
        }
    });

    // Like button
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        likeMeme(meme._id, card);
    });

    return card;
}

// Show Meme Modal
function showMemeModal(meme) {
    modalBody.innerHTML = `
        <img src="${meme.imageUrl}" alt="${meme.caption}" class="modal-meme-image">
        <h3>${escapeHtml(meme.caption)}</h3>
        <p><strong>Prompt:</strong> ${escapeHtml(meme.prompt)}</p>
        <p><strong>Author:</strong> ${escapeHtml(meme.author)}</p>
        <div class="meme-stats mt-1">
            <div class="stat">❤️ ${meme.likes} likes</div>
            <div class="stat">👁️ ${meme.views} views</div>
        </div>
    `;
    memeModal.classList.add('show');
}

// Like Meme
async function likeMeme(memeId, card) {
    try {
        const response = await fetch(`${API_BASE_URL}/memes/${memeId}/like`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            const likeBtn = card.querySelector('.like-btn');
            const likeCount = card.querySelector('.meme-stats .stat:first-child span');
            likeCount.textContent = data.meme.likes;
            likeBtn.classList.add('liked');
        }
    } catch (error) {
        console.error('Error liking meme:', error);
    }
}

// Increment View
async function incrementView(memeId) {
    try {
        await fetch(`${API_BASE_URL}/memes/${memeId}/view`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Error incrementing view:', error);
    }
}

// Show Status Message
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status-message show ${type}`;

    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 5000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-refresh stats every 30 seconds
setInterval(loadStats, 30000);
