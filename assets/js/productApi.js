// =============================================
// products.js - Shopee Affiliate (High CTR Version)
// Click Tracking + Psychological Triggers
// =============================================

function initProducts() {
    const grid = document.getElementById('products-grid');
    const loading = document.getElementById('loading-skeleton');
    const empty = document.getElementById('empty-state');

    if (!grid || !loading || !empty) return;

    loading.classList.remove('hidden');
    grid.classList.add('hidden');
    empty.classList.add('hidden');

    const API = 'https://api.daksystem.net/api/baitap/products_gaming/index.php?action=get_products';

    fetch(API)
        .then(res => res.json())
        .then(data => {
            loading.classList.add('hidden');
            const products = data.products || [];

            if (products.length === 0) {
                empty.classList.remove('hidden');
            } else {
                grid.classList.remove('hidden');
                renderCards(products, grid);
            }
        })
        .catch(() => {
            loading.classList.add('hidden');
            empty.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-5xl text-amber-400 mb-5"></i>
          <h3 class="text-2xl font-extrabold text-white mb-2">Không thể tải sản phẩm</h3>
          <p class="text-zinc-400 text-sm mb-6">Vui lòng thử lại sau</p>
          <button onclick="window.location.reload()" 
                  class="px-8 py-3.5 bg-white text-black font-extrabold rounded-2xl text-sm flex items-center gap-2 mx-auto active:scale-95 transition">
            <i class="fas fa-redo mr-2"></i> THỬ LẠI NGAY
          </button>
        </div>`;
            empty.classList.remove('hidden');
        });
}

function renderCards(products, container) {
    container.innerHTML = '';

    products.forEach((product, index) => {
        const thumb = product.thumbnail_url || product.image || 'https://picsum.photos/id/1015/600/450';
        const name = product.product_name || product.name || 'Sản phẩm Free Fire';
        const link = product.affiliate_link || product.link || '#';
        const productId = product.id || product.product_id || index;

        const badge = index % 3 === 0 ? '🔥 HOT' : 'GIẢM 30%';
        const sold = Math.floor(Math.random() * 8000) + 1200;
        const rating = (Math.random() * 0.5 + 4.5).toFixed(1);

        const card = document.createElement('a');
        card.href = link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = `group flex flex-col bg-[#1e2937] rounded-3xl overflow-hidden border border-zinc-700 active:scale-[0.985] transition-all duration-300 hover:border-[#00ff9d] hover:shadow-[0_0_20px_-5px_#00ff9d]`;

        card.innerHTML = `
            <!-- Ảnh + Badge -->
            <div class="relative">
                <img src="${thumb}" 
                     alt="${name}" 
                     class="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                     loading="lazy">
                
                <div class="absolute top-2 right-2 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full shadow bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center gap-1">
                    ${badge}
                </div>
            </div>

            <!-- Nội dung -->
            <div class="p-3.5 flex flex-col flex-1">
                <!-- Tên sản phẩm -->
                <h3 class="font-extrabold text-white text-[14px] leading-tight line-clamp-2 mb-2 group-hover:text-[#00ff9d] transition-colors">
                    ${name}
                </h3>

                <!-- Rating + Đã bán -->
                <div class="flex items-center justify-between text-xs mb-3">
                    <div class="flex items-center gap-1 text-yellow-400">
                        <span>⭐</span>
                        <span class="font-semibold text-white">${rating}</span>
                        
                        <span class="text-zinc-400">(${Math.floor(Math.random() * 3000) + 800})</span>
                    </div>
                </div>

                <!-- Giá -->
                <div class="flex items-baseline gap-2 mb-3">
                    <span class="text-red-500 font-extrabold text-xl">9.000đ</span>
                
                    <span class="text-zinc-400 line-through text-sm">99.000đ</span>
                </div>

                <!-- Nút Mua Ngay -->
                <div class="mt-auto">
                    <div class="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-[0.985] transition-all shadow-md">
                        MUA NGAY
                    </div>
                </div>
            </div>
        `;

        // Click tracking
        card.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                await fetch(`https://api.daksystem.net/api/baitap/products_gaming/index.php?action=click_product&product_id=${productId}`, {
                    method: 'POST',
                    mode: 'no-cors'
                });
            } catch (err) {}
            window.open(link, '_blank');
        });

        container.appendChild(card);
    });
}
// Auto init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
} else {
    initProducts();
}