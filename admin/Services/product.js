const API_BASE = 'https://api.daksystem.net/api/baitap/products_gaming/index.php';

let currentProducts = [];

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.className = `toast flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white ${bgColor}`;
    toast.innerHTML = `
        <i class="fas ${icon} text-xl"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 2500);
}

// ==================== API ====================
async function callAPI(action, method = 'GET', data = null) {
    let url = `${API_BASE}?action=${action}`;
    
    const options = { method };

    if (data && method === 'POST') {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        options.body = formData;
    }

    const res = await fetch(url, options);
    return await res.json();
}

// ==================== LOAD ====================
async function loadProducts() {
    const result = await callAPI('get_products');
    currentProducts = result.products || [];
    renderProducts(currentProducts);
}

// ==================== RENDER ====================
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    products.forEach(p => {
        const name = p.product_name || 'No name';
        const img = p.thumbnail_url || 'https://picsum.photos/300';
        
        const card = document.createElement('div');
        card.className = 'bg-zinc-900 p-3 rounded-2xl';

        card.innerHTML = `
            <img src="${img}" class="w-full h-40 object-cover rounded-xl mb-2">
            <h3 class="font-bold text-sm">${name}</h3>
            
            <div class="flex gap-2 mt-3">
                <button onclick="editProduct(${p.id})">Sửa</button>
                <button onclick="deleteProduct(${p.id})">Xóa</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ==================== SUBMIT ====================
async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('gaming_name').value.trim();
    const link = document.getElementById('gaming_link').value.trim();
    const image = document.getElementById('gaming_image').value.trim();

    // 🚨 VALIDATE
    if (!name || !link || !image) {
        showToast('Vui lòng nhập đầy đủ!', 'error');
        return;
    }

    // ✅ FIX: mapping đúng field backend
    const data = {
        product_name: name,
        affiliate_link: link,
        thumbnail_url: image
    };

    try {
        let action = isEditing ? 'update_product' : 'create_product';

        if (isEditing) {
            data.id = editingId;
        }

        const result = await callAPI(action, 'POST', data);

        console.log('API RESULT:', result);

        if (result.success || result.status === 'success') {
            showToast('Thành công!');
            closeModal();
            loadProducts();
        } else {
            throw new Error(result.message || 'Lỗi');
        }

    } catch (err) {
        console.error(err);
        showToast('Lỗi: ' + err.message, 'error');
    }
}

// ==================== DELETE ====================
async function deleteProduct(id) {
    if (!confirm('Xóa sản phẩm?')) return;

    const result = await callAPI('delete_product', 'POST', { id });

    if (result.success) {
        showToast('Đã xóa');
        loadProducts();
    }
}

// ==================== EDIT ====================
function editProduct(id) {
    const p = currentProducts.find(x => x.id == id);
    if (!p) return;

    isEditing = true;
    editingId = id;

    document.getElementById('gaming_name').value = p.product_name;
    document.getElementById('gaming_link').value = p.affiliate_link;
    document.getElementById('gaming_image').value = p.thumbnail_url;

    openAddModal();
}

// ==================== INIT ====================
function initAdmin() {
    loadProducts();
}

initAdmin();