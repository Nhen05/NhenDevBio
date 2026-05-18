const DB_URL = 'database/db.json';

let allFiles = [];
let currentCategory = '';
let currentPage = 1;
const ITEMS_PER_PAGE = 6;   // Bạn có thể thay đổi số lượng hiển thị mỗi trang

// Khởi tạo khi trang tải
window.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
});

async function loadDatabase() {
    try {
        const response = await fetch(DB_URL);
        const data = await response.json();
        
        allFiles = data.files || [];
        
        renderCategories(data.categories || []);
        renderFiles(allFiles);
        renderPagination();
        
    } catch (error) {
        console.error("Lỗi tải database:", error);
        document.getElementById('container-file').innerHTML = 
            '<p class="text-danger text-center">Không thể tải dữ liệu!</p>';
    }
}

// Render Categories
function renderCategories(categories) {
    let catBox = document.getElementById('category-box');
    if (!catBox) {
        catBox = document.createElement('div');
        catBox.id = 'category-box';
        catBox.className = 'd-flex flex-wrap gap-2 mb-4 justify-content-center';
        document.getElementById('container-file').before(catBox);
    }

    let html = `<button class="category-btn ${currentCategory === '' ? 'active' : ''}" onclick="filterByCategory('')">Tất cả</button>`;

    categories.forEach(cat => {
        const active = currentCategory == cat.id ? 'active' : '';
        html += `<button class="category-btn ${active}" onclick="filterByCategory(${cat.id})">${cat.name}</button>`;
    });

    catBox.innerHTML = html;
}

// Lọc theo Category
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    currentPage = 1;
    renderFiles(allFiles);
    renderPagination();
}

// Render Files
function renderFiles(files) {
    const container = document.getElementById('container-file');
    container.style.opacity = '0.5';

    // Lọc theo category
    let filtered = files;
    if (currentCategory !== '') {
        filtered = files.filter(file => file.category_id == currentCategory);
    }

    // Phân trang
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedFiles = filtered.slice(start, start + ITEMS_PER_PAGE);

    if (paginatedFiles.length === 0) {
        container.innerHTML = '<div class="text-center w-100 text-white">Không có sản phẩm nào.</div>';
        container.style.opacity = '1';
        return;
    }

    container.innerHTML = paginatedFiles.map(file => {
        const typeLower = (file.type || '').toLowerCase();
        return `
        <div class="product-card">
            <div class="card-image-container">
                <img src="${file.image}" class="card-gif" onerror="this.src='https://via.placeholder.com/300x160'">
                <div class="${typeLower}-label">${(file.type || 'HACK').toUpperCase()}</div>
            </div>
            <div class="card-title">🔥 ${file.title}</div>
            <div class="card-desc">${file.description}</div>
            <p class="card-author">Phát triển bởi ${file.author}</p>
            <div class="card-meta my-4 mx-auto">
                <span class="card-type ${typeLower}">${file.type || 'HACK'}</span>
                <span class="card-stock">Có Sẵn: ${file.is_unlimited ? '∞' : file.stock}</span>
            </div>
            <a href="${file.download_url}" target="_blank" class="download-btn">📥 Tải Ngay</a>
        </div>`;
    }).join('');

    container.style.opacity = '1';
}

// Render Pagination (Client-side)
function renderPagination() {
    let pgBox = document.getElementById('pagination-box');
    if (!pgBox) {
        pgBox = document.createElement('nav');
        pgBox.id = 'pagination-box';
        pgBox.className = 'pagination-box mt-4';
        document.getElementById('container-file').after(pgBox);
    }

    let filtered = allFiles;
    if (currentCategory !== '') {
        filtered = allFiles.filter(f => f.category_id == currentCategory);
    }

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) {
        pgBox.innerHTML = '';
        return;
    }

    let html = `<ul class="pagination justify-content-center">`;

    // Previous
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <button class="page-link" onclick="changePage(${currentPage - 1})">‹</button>
             </li>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                    <button class="page-link" onclick="changePage(${i})">${i}</button>
                 </li>`;
    }

    // Next
    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <button class="page-link" onclick="changePage(${currentPage + 1})">›</button>
             </li>`;

    html += `</ul>`;
    pgBox.innerHTML = html;
}

function changePage(page) {
    if (page < 1 || page > Math.ceil(allFiles.length / ITEMS_PER_PAGE)) return;
    currentPage = page;
    renderFiles(allFiles);
    renderPagination();
}