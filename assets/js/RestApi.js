
async function updateVisitorCount() {
    const countEl = document.getElementById('visitorCount');
    try {
        const response = await fetch('https://api.countapi.xyz/get/nhendeveloper/unique_visits');
        const data = await response.json();
        countEl.textContent = `Số người truy cập: ${data.value.toLocaleString('vi-VN')}+`;
    } catch (e) {
        countEl.textContent = `Số người truy cập: 1,245+`;
    }
}

window.addEventListener('load', () => {
    updateVisitorCount();
});
const API_URL = "https://api.dak.edu.vn/game_store/index.php?action=get_files";
let currentCategory = '';
let currentPage = 1;

// Khởi tạo khi trang tải xong
window.addEventListener('DOMContentLoaded', () => {
    loadData();
});

async function loadData(page = 1, categoryId = '') {
    currentPage = page;
    currentCategory = categoryId;

    const containerFile = document.getElementById('container-file');
    // Hiệu ứng loading đơn giản
    containerFile.style.opacity = '0.5';

    try {
        const response = await fetch(`${API_URL}&page=${page}&category_id=${categoryId}`);
        const data = await response.json();

        renderCategories(data.categories);
        renderFiles(data.files);
        renderPagination(data.pagination);

        containerFile.style.opacity = '1';
    } catch (error) {
        console.error("Lỗi fetch API:", error);
        containerFile.innerHTML = '<p class="text-danger">Không thể tải dữ liệu!</p>';
    }
}

// 1. Render Categories (Bootstrap 5 buttons) ngay trên đầu container-file
function renderCategories(categories) {
    // Tìm hoặc tạo nơi chứa category (ngay trước container-file)
    let catBox = document.getElementById('category-box');
    if (!catBox) {
        catBox = document.createElement('div');
        catBox.id = 'category-box';
        catBox.className = 'd-flex flex-wrap gap-2 mb-4 justify-content-center';
        document.getElementById('container-file').before(catBox);
    }

    let html = `<button class="category-btn ${currentCategory === '' ? 'active' : ''}" onclick="loadData(1, '')">Tất cả</button>`;

    categories.forEach(cat => {
        const activeClass = currentCategory == cat.id ? 'active' : '';
        html += `<button class="category-btn ${activeClass}" onclick="loadData(1, '${cat.id}')">${cat.name}</button>`;
    });
    catBox.innerHTML = html;
}

// 2. Render danh sách file vào #container-file
function renderFiles(files) {
    const containerFile = document.getElementById('container-file');

    if (!files || files.length === 0) {
        containerFile.innerHTML = '<div class="text-center w-100 text-white">Không có sản phẩm nào.</div>';
        return;
    }

    containerFile.innerHTML = files.map(file => {
        // Xử lý Class nhãn dựa trên Type từ API (vip, premium, limited, updated)
        const typeLower = file.type.toLowerCase();
        const labelClass = `${typeLower}-label`;

        return `
        <div class="product-card">
            <div class="card-image-container">
                <img src="${file.image}" class="card-gif" onerror="this.src='https://via.placeholder.com/300x160'">
                <div class="${labelClass}">${file.type.toUpperCase()}</div>
            </div>
            <div class="card-title">🔥 ${file.title}</div>
            <div class="card-desc">${file.description}</div>
            <p class="card-author">Phát triển bởi ${file.author}</p>
            <div class="card-meta my-4 mx-auto">
                <span class="card-type ${typeLower}">${file.category_name || 'HACK'}</span>
                <span class="card-stock">Có Sẵn: ${file.is_unlimited == 1 ? '999+' : file.stock}</span>
            </div>
            <a href="${file.download_url}" target="_blank" class="download-btn">📥 Tải Ngay</a>
        </div>`;
    }).join('');
}

// 3. Render Phân trang (Pagination) bên dưới container-file
function renderPagination(paging) {
    let pgBox = document.getElementById('pagination-box');
    if (!pgBox) {
        pgBox = document.createElement('nav');
        pgBox.id = 'pagination-box';
        pgBox.className = 'pagination-box';
        document.getElementById('container-file').after(pgBox);
    }

    if (paging.total_pages <= 1) {
        pgBox.innerHTML = '';
        return;
    }

    let current = paging.current_page;
    let total = paging.total_pages;

    let items = '';

    // chỉ hiển thị 5 trang quanh current
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (start > 1) {
        items += `<li class="page-item"><span class="page-dot">...</span></li>`;
    }

    for (let i = start; i <= end; i++) {
        items += `
        <li class="page-item ${current === i ? 'active' : ''}">
            <button class="page-link" onclick="loadData(${i}, '${currentCategory}')">${i}</button>
        </li>`;
    }

    if (end < total) {
        items += `<li class="page-item"><span class="page-dot">...</span></li>`;
    }

    pgBox.innerHTML = `
    <ul class="pagination">
        <li class="page-item ${current === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="loadData(${current - 1}, '${currentCategory}')">‹</button>
        </li>

        ${items}

        <li class="page-item ${current === total ? 'disabled' : ''}">
            <button class="page-link" onclick="loadData(${current + 1}, '${currentCategory}')">›</button>
        </li>
    </ul>`;
}
