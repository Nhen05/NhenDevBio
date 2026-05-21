

const API_BASE = 'https://api.daksystem.net/api/baitap/products_gaming/index.php';


let currentProducts = [];

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
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
    }, 2800);
}

// ==================== API CALL ====================
async function callAPI(action, method = 'GET', data = null) {
    let url = `${API_BASE}?action=${action}`;
    
    const options = {
        method: method,
        headers: {}
    };
    
    if (data) {
        if (method === 'POST') {
            const formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]));
            options.body = formData;
        }
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== LOAD PRODUCTS ====================
async function loadProducts() {
    const grid = document.getElementById('products-grid');
    const empty = document.getElementById('empty-state');
    
    grid.innerHTML = `
        <div class="col-span-full flex justify-center py-8">
            <div class="animate-spin w-8 h-8 border-4 border-zinc-700 border-t-[#00ff9d] rounded-full"></div>
        </div>
    `;
    
    try {
        const result = await callAPI('get_products');
        currentProducts = result.products || [];
        
        grid.innerHTML = '';
        empty.classList.add('hidden');
        
        if (currentProducts.length === 0) {
            empty.classList.remove('hidden');
        } else {
            renderProducts(currentProducts);
            document.getElementById('product-count').textContent = currentProducts.length;
            document.getElementById('last-update').textContent = 'Vừa xong';
        }
    } catch (error) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <p class="text-red-400">Không thể tải danh sách sản phẩm</p>
            </div>
        `;
        showToast('Lỗi tải dữ liệu!', 'error');
    }
}

// ==================== RENDER PRODUCTS ====================
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = `gaming-card bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col`;
        
        card.innerHTML = `
            <!-- Image -->
            <div class="relative">
                <img src="${product.gaming_image || product.thumbnail_url || 'https://picsum.photos/id/1015/600/400'}" 
                     alt="${product.gaming_name || product.product_name}" 
                     class="w-full h-48 object-cover product-image"
                     onerror="this.src='https://picsum.photos/id/1015/600/400'">
                
                <div class="absolute top-3 right-3 bg-black/70 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                    <i class="fas fa-link text-[#00ff9d]"></i>
                    <span>Shopee</span>
                </div>
            </div>
            
            <!-- Content -->
            <div class="p-4 flex flex-col flex-1">
                <h3 class="font-extrabold text-lg leading-tight line-clamp-2 mb-3">
                    ${product.gaming_name || product.product_name || 'Sản phẩm không tên'}
                </h3>
                
                <div class="mt-auto flex items-center justify-between gap-2">
                    <!-- Edit Button -->
                    <button onclick="editProduct(${product.id})" 
                            class="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl font-bold text-sm transition">
                        <i class="fas fa-edit"></i>
                        <span>Sửa</span>
                    </button>
                    
                    <!-- Delete Button -->
                    <button onclick="deleteProduct(${product.id}, '${(product.gaming_name || product.product_name || '').replace(/'/g, "\\'")}')" 
                            class="flex-1 flex items-center justify-center gap-2 py-3 bg-red-900/30 hover:bg-red-900/50 active:bg-red-900 rounded-2xl font-bold text-sm text-red-400 transition">
                        <i class="fas fa-trash"></i>
                        <span>Xóa</span>
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ==================== MODAL ====================
let isEditing = false;
let editingId = null;

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

function editProduct(id) {
    const product = currentProducts.find(p => p.id == id);
    if (!product) return;
    
    isEditing = true;
    editingId = id;
    
    document.getElementById('modal-title').textContent = 'Chỉnh sửa sản phẩm';
    document.getElementById('submit-text').textContent = 'CẬP NHẬT';
    
    // Fill form
    document.getElementById('product-id').value = id;
    document.getElementById('gaming_name').value = product.gaming_name || product.product_name || '';
    document.getElementById('gaming_link').value = product.gaming_link || product.affiliate_link || '';
    document.getElementById('gaming_image').value = product.gaming_image || product.thumbnail_url || '';
    
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

// ==================== FORM SUBMIT ====================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin mr-2"></i> 
        ${isEditing ? 'ĐANG CẬP NHẬT...' : 'ĐANG THÊM...'}
    `;
    
    const formData = {
        gaming_name: document.getElementById('gaming_name').value.trim(),
        gaming_link: document.getElementById('gaming_link').value.trim(),
        gaming_image: document.getElementById('gaming_image').value.trim()
    };
    
    try {
        let action = isEditing ? 'update_product' : 'create_product';
        if (isEditing) {
            formData.id = editingId;
        }
        
        const result = await callAPI(action, 'POST', formData);
        
        if (result.success || result.status === 'success') {
            showToast(isEditing ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!');
            closeModal();
            await loadProducts(); // Reload list
        } else {
            throw new Error(result.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        showToast('Thao tác thất bại: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ==================== DELETE ====================
async function deleteProduct(id, name) {
    if (!confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
    
    try {
        const result = await callAPI('delete_product', 'POST', { id: id });
        
        if (result.success || result.status === 'success') {
            showToast('Đã xóa sản phẩm');
            await loadProducts();
        } else {
            throw new Error('Xóa thất bại');
        }
    } catch (error) {
        showToast('Không thể xóa sản phẩm', 'error');
    }
}

// ==================== INIT ====================
function initAdmin() {
    // Load products on start
    loadProducts();
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modal');
            if (!modal.classList.contains('hidden')) {
                closeModal();
            }
        }
        
        if (e.key === '/' && document.activeElement.tagName === 'BODY') {
            e.preventDefault();
            openAddModal();
        }
    });
    
    // Auto refresh every 60 seconds (optional)
    // setInterval(loadProducts, 60000);
    
    console.log('%c[Gaming Admin] Panel initialized successfully', 'color:#00ff9d');
}

// Start the app
initAdmin();