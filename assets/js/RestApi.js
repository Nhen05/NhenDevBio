const API_URL = 'https://api.daksystem.net/api/baitap/game_store/index.php?action=get_files';

let allFiles = [];
let currentCategory = '';
let currentPage = 1;

// INIT
window.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
});

// LOAD API
async function loadDatabase(page = 1, categoryId = '') {
    const container = document.getElementById('container-file');
    container.style.opacity = '0.5';

    try {
        let url = `${API_URL}&page=${page}`;
        if (categoryId !== '') {
            url += `&category_id=${categoryId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        allFiles = data.files || [];
        currentPage = data.pagination?.page || 1;

        renderCategories(data.categories || []);
        renderFiles(allFiles);
        renderPagination(data.pagination);

    } catch (error) {
        console.error("Lỗi API:", error);
        container.innerHTML =
            '<p class="text-danger text-center">Không thể tải dữ liệu!</p>';
    }

    container.style.opacity = '1';
}

// CATEGORY
function renderCategories(categories) {
    let catBox = document.getElementById('category-box');
    if (!catBox) {
        catBox = document.createElement('div');
        catBox.id = 'category-box';
        catBox.className = 'd-flex flex-wrap gap-2 mb-4 justify-content-center';
        document.getElementById('container-file').before(catBox);
    }

    let html = `
        <button class="category-btn ${currentCategory === '' ? 'active' : ''}" 
        onclick="filterByCategory('')">Tất cả</button>
    `;

    categories.forEach(cat => {
        const active = currentCategory == cat.id ? 'active' : '';
        html += `
            <button class="category-btn ${active}" 
            onclick="filterByCategory(${cat.id})">${cat.name}</button>
        `;
    });

    catBox.innerHTML = html;
}

// FILTER (SERVER SIDE)
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    loadDatabase(1, categoryId);
}

// RENDER FILES (NO CLIENT FILTER + NO CLIENT PAGINATION)
function renderFiles(files) {
    const container = document.getElementById('container-file');

    if (!files.length) {
        container.innerHTML = '<div class="text-center w-100 text-white">Không có sản phẩm nào.</div>';
        return;
    }

    container.innerHTML = files.map(file => {
        const typeLower = (file.type || '').toLowerCase();
        return `
        <div class="product-card">
            <div class="card-image-container">
                <img src="${file.image}" class="card-gif"
                onerror="this.src='https://via.placeholder.com/300x160'">

                <div class="${typeLower}-label">
                    ${(file.type || 'FREE').toUpperCase()}
                </div>
            </div>

            <div class="card-title">🔥 ${file.title}</div>
            <div class="card-desc">${file.description}</div>

            <p class="card-author">Phát triển bởi ${file.author}</p>

            <div class="card-meta my-4 mx-auto">
                <span class="card-type ${typeLower}">
                    ${file.type || 'FREE'}
                </span>

                <span class="card-stock">
                    Có Sẵn: ${file.is_unlimited ? '∞' : file.stock}
                </span>
            </div>

            <a href="${file.download_url}" target="_blank" class="download-btn">
                📥 Tải Ngay
            </a>
        </div>`;
    }).join('');
}

// PAGINATION (SERVER)
function renderPagination(pagination) {
    let pgBox = document.getElementById('pagination-box');
    if (!pgBox) {
        pgBox = document.createElement('nav');
        pgBox.id = 'pagination-box';
        pgBox.className = 'pagination-box mt-4';
        document.getElementById('container-file').after(pgBox);
    }

    const totalPages = pagination?.pages || 1;
    const current = pagination?.page || 1;

    if (totalPages <= 1) {
        pgBox.innerHTML = '';
        return;
    }

    let html = `<ul class="pagination justify-content-center">`;

    // PREV
    html += `
        <li class="page-item ${current === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(${current - 1})">‹</button>
        </li>
    `;

    // NUMBER
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${current === i ? 'active' : ''}">
                <button class="page-link" onclick="changePage(${i})">${i}</button>
            </li>
        `;
    }

    // NEXT
    html += `
        <li class="page-item ${current === totalPages ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(${current + 1})">›</button>
        </li>
    `;

    html += `</ul>`;
    pgBox.innerHTML = html;
}

// CHANGE PAGE
function changePage(page) {
    if (page < 1) return;
    loadDatabase(page, currentCategory);
}