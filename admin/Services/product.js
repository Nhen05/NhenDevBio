// =============================================
// admin-fixed.js - FIXED VERSION (Event Delegation)
// Best Practice: No inline onclick
// =============================================

const API_BASE = 'https://api.daksystem.net/api/baitap/products_gaming/index.php';
let currentProducts = [];
let isEditing = false;
let editingId = null;

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    toast.className = `toast flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white ${bgColor} max-w-xs`;
    toast.innerHTML = `
        <i class="fas ${icon} text-xl"></i>
        <span class="font-semibold">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all 0.3s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ==================== API ====================
async function callAPI(action, method = 'GET', data = null) {
    let url = `${API_BASE}?action=${action}&api_key=demo_key_2026`;

    const options = { method };

    if (data && method === 'POST') {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        options.body = formData;
    }

    try {
        const res = await fetch(url, options);
        return await res.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast('Lỗi kết nối API', 'error');
        throw error;
    }
}

// ==================== LOAD PRODUCTS ====================
async function loadProducts() {
    const grid = document.getElementById('products-grid');
    const empty = document.getElementById('empty-state');
    const countEl = document.getElementById('product-count');

    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full flex justify-center py-8">
            <div class="animate-spin w-8 h-8 border-4 border-zinc-700 border-t-[#00ff9d] rounded-full"></div>
        </div>
    `;

    try {
        const result = await callAPI('get_products');
        currentProducts = result.products || [];

        grid.innerHTML = '';

        if (currentProducts.length === 0) {
            empty.classList.remove('hidden');
            grid.classList.add('hidden');
        } else {
            empty.classList.add('hidden');
            grid.classList.remove('hidden');
            renderProducts(currentProducts);
        }

        if (countEl) countEl.innerText = currentProducts.length;

    } catch (error) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <p class="text-red-400">Không thể tải danh sách sản phẩm</p>
            </div>
        `;
    }
}

// ==================== RENDER PRODUCTS (FIXED - NO ONCLICK) ====================
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';

    products.forEach(p => {
        const name = p.product_name || p.gaming_name || 'Sản phẩm không tên';
        const img = p.thumbnail_url || p.gaming_image || 'https://picsum.photos/id/1015/600/400';

        const card = document.createElement('div');
        card.className = 'bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col';

        card.innerHTML = `
            <div class="relative">
                <img src="${img}" class="w-full h-48 object-cover" 
                     onerror="this.src='https://picsum.photos/id/1015/600/400'">
            </div>
            
            <div class="p-4 flex flex-col flex-1">
                <h3 class="font-extrabold text-lg leading-tight line-clamp-2 mb-4">${name}</h3>
                
                <div class="mt-auto flex gap-3">
                    <button class="btn-edit flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2"
                            data-id="${p.id}">
                        <i class="fas fa-edit"></i>
                        <span>Sửa</span>
                    </button>
                    
                    <button class="btn-delete flex-1 py-3 bg-red-900/30 hover:bg-red-900/50 active:bg-red-900 rounded-2xl font-bold text-sm text-red-400 transition flex items-center justify-center gap-2"
                            data-id="${p.id}">
                        <i class="fas fa-trash"></i>
                        <span>Xóa</span>
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ==================== EVENT DELEGATION (FIXED - ONE LISTENER) ====================
function setupEventListeners() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.onclick = null;

    grid.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.btn-edit');
        const deleteBtn = e.target.closest('.btn-delete');

        if (editBtn) {
            const id = editBtn.dataset.id;
            console.log('CLICK EDIT', id);
            editProduct(id);
        }

        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            console.log('CLICK DELETE', id);
            deleteProduct(id);
        }
    });

    console.log('%c[Admin] Event Delegation initialized', 'color:#00ff9d');
}

// ==================== EDIT ====================
function editProduct(id) {
    const p = currentProducts.find(x => x.id == id);
    if (!p) {
        showToast('Không tìm thấy sản phẩm', 'error');
        return;
    }

    isEditing = true;
    editingId = id;

    document.getElementById('gaming_name').value = p.product_name || p.gaming_name || '';
    document.getElementById('gaming_link').value = p.affiliate_link || p.gaming_link || '';
    document.getElementById('gaming_image').value = p.thumbnail_url || p.gaming_image || '';

    document.getElementById('modal-title').textContent = 'Chỉnh sửa sản phẩm';
    document.getElementById('submit-text').textContent = 'CẬP NHẬT';
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
}

// ==================== DELETE ====================
async function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
        const result = await callAPI('delete_product', 'POST', { id });
        
        if (result.success || result.status === 'success') {
            showToast('Đã xóa sản phẩm thành công');
            loadProducts();
        } else {
            showToast('Xóa thất bại: ' + (result.message || 'Lỗi không xác định'), 'error');
        }
    } catch (error) {
        showToast('Không thể xóa sản phẩm', 'error');
    }
}

// ==================== FORM SUBMIT ====================
async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('gaming_name').value.trim();
    const link = document.getElementById('gaming_link').value.trim();
    const image = document.getElementById('gaming_image').value.trim();

    if (!name || !link || !image) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }

    const data = {
        product_name: name,
        affiliate_link: link,
        thumbnail_url: image
    };

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Đang xử lý...`;

    try {
        let action = isEditing ? 'update_product' : 'create_product';
        if (isEditing) data.id = editingId;

        const result = await callAPI(action, 'POST', data);

        if (result.success || result.status === 'success') {
            showToast(isEditing ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!');
            closeModal();
            loadProducts();
        } else {
            throw new Error(result.message || 'Có lỗi xảy ra');
        }
    } catch (err) {
        showToast('Thao tác thất bại: ' + err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ==================== MODAL ====================
function openAddModal() {
    isEditing = false;
    editingId = null;

    document.getElementById('modal-title').textContent = 'Thêm sản phẩm mới';
    document.getElementById('submit-text').textContent = 'THÊM SẢN PHẨM';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';

    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

// ==================== INIT ====================
function initAdmin() {
    setupEventListeners();
    loadProducts();

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeModal();
            }
        }
    });

    console.log('%c[Admin Panel] Fixed version initialized successfully', 'color:#00ff9d');
}

// Start
initAdmin();