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

  const badgeList = ['🔥 HOT', '⚡ DEAL', '💥 GIÁ SỐC'];
  const hotLines = ['✔ Đang hot trên Shopee', '⚡ Sắp cháy hàng', '🔥 Bán chạy nhất tuần'];
  const ctaTexts = ['MUA NGAY ⚡', 'XEM NGAY 🔥'];

  products.forEach((product, index) => {
    const thumb = product.thumbnail_url || product.image || 'https://picsum.photos/id/1015/600/600';
    const name = product.product_name || product.name || 'Sản phẩm Free Fire';
    const link = product.affiliate_link || product.link || '#';
    const productId = product.id || product.product_id || index;

    const badge = badgeList[index % badgeList.length];
    const hotLine = hotLines[index % hotLines.length];
    const ctaText = ctaTexts[index % ctaTexts.length];
    const viewers = Math.floor(Math.random() * 2200) + 850;

    const card = document.createElement('a');
    card.href = link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = `group flex flex-col bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 active:scale-[0.975] transition-all duration-200 hover:border-[#00ff9d] hover:shadow-[0_0_30px_-8px_#00ff9d]`;

    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img 
          src="${thumb}" 
          alt="${name} Shopee giá rẻ"
          class="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        >
        <div class="absolute top-3 right-3 px-3.5 py-[5px] text-[10px] font-extrabold tracking-wider rounded-full shadow-lg bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 text-white flex items-center gap-1">
          ${badge}
        </div>
      </div>

      <div class="p-4 flex flex-col flex-1">
        <h3 class="font-extrabold text-white text-[15.5px] leading-tight line-clamp-2 mb-2 group-hover:text-[#00ff9d] transition-colors">
          ${name}
        </h3>

        <div class="flex items-center justify-between text-xs mb-4">
          <div class="flex items-center gap-1 text-emerald-400">
            <span>${hotLine}</span>
          </div>
          <div class="flex items-center gap-1 text-zinc-400">
            <span>👥</span>
            <span class="font-medium">${viewers}+ đã xem</span>
          </div>
        </div>

        <div class="mt-auto">
          <div class="w-full py-[13px] bg-gradient-to-r from-[#00ff9d] to-[#39ff14] text-black font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_15px_rgb(0,255,157,0.35)] active:scale-[0.985] transition-all">
            ${ctaText}
          </div>
        </div>
      </div>
    `;

    // === CLICK TRACKING (QUAN TRỌNG) ===
    card.addEventListener('click', async function(e) {
      e.preventDefault();
      
      try {
        await fetch(`https://api.daksystem.net/api/baitap/products_gaming/index.php?action=click_product&product_id=${productId}`, {
          method: 'POST',
          mode: 'no-cors'
        });
      } catch (err) {
        console.log('[Tracking] Click logged');
      }
      
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