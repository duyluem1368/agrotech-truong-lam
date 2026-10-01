const menuButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const modal = document.querySelector('#productModal');
const productKnowledge = {
  'Pitako USA 18.5SC': { targets: ['Sâu keo mùa thu trên ngô', 'Nhóm sâu non bộ cánh vảy'], note: 'Đăng ký trên nhãn: sâu keo mùa thu trên cây ngô. Hoạt chất Chlorantraniliprole tác động lên cơ côn trùng.' },
  'Cetamiusavb 35WG': { targets: ['Bọ trĩ trên hoa cúc', 'Nhóm côn trùng chích hút'], note: 'Đăng ký trên nhãn: bọ trĩ trên hoa cúc. Phối hợp Acetamiprid và Flonicamid cho tác động kép.' },
  'Sharking 25SC': { targets: ['Sâu keo trên ngô', 'Nhóm sâu ăn lá'], note: 'Đăng ký trên nhãn: sâu keo trên cây ngô. Phối hợp Chlorantraniliprole và Chlorfenapyr.' },
  'SV-Stellar 30SC': { targets: ['Rầy', 'Rệp', 'Bọ trĩ', 'Nhóm chích hút'], note: 'Clothianidin thuộc nhóm neonicotinoid, tác động lên hệ thần kinh côn trùng. Đối tượng sử dụng cụ thể phải theo nhãn sản phẩm.' },
  'Unizeb M-45 80WP': { targets: ['Thán thư trên thanh long', 'Nhóm bệnh nấm bề mặt'], note: 'Đăng ký trên nhãn: bệnh thán thư trên thanh long. Mancozeb là hoạt chất tiếp xúc đa điểm.' },
  'Mitado 350SC': { targets: ['Rầy mềm', 'Rệp', 'Bọ phấn', 'Nhóm chích hút'], note: 'Imidacloprid có tính lưu dẫn. Chỉ lựa chọn cây trồng và đối tượng đúng nội dung trên nhãn sản phẩm.' },
  'TukTuk 20SC': { targets: ['Sâu ăn lá', 'Rầy, rệp', 'Nhóm chích hút'], note: 'Phối hợp Lambda-cyhalothrin và Thiamethoxam. Cần đối chiếu mặt sau nhãn trước khi xác định liều và cây trồng.' },
  'Nofada 822WP': { targets: ['Đạo ôn trên lúa', 'Nhóm bệnh nấm trên lúa'], note: 'Đăng ký trên nhãn: bệnh đạo ôn trên lúa. Hỗn hợp ba hoạt chất có tính lưu dẫn.' },
  'Masterone 26SC': { targets: ['Thán thư trên cà phê', 'Nhóm bệnh nấm gây đốm'], note: 'Đăng ký trên nhãn: bệnh thán thư trên cà phê. Phối hợp Fenoxanil và Kresoxim-methyl.' }
};

function openProductModal(card) {
  const name = card.querySelector('h3').textContent.trim();
  const image = card.querySelector('img');
  const active = card.querySelector('p b')?.textContent || 'Xem thông tin hoạt chất trên nhãn';
  const info = productKnowledge[name] || { targets: ['Liên hệ chuyên viên để đối chiếu nhãn'], note: 'Thông tin đang được cập nhật theo nhãn sản phẩm.' };
  document.querySelector('#modalProductName').textContent = name;
  document.querySelector('#modalProductImage').src = image.src;
  document.querySelector('#modalProductImage').alt = image.alt;
  document.querySelector('#modalActive').textContent = active;
  document.querySelector('#modalTargets').innerHTML = info.targets.map(target => `<span>${target}</span>`).join('');
  document.querySelector('#modalNote').textContent = info.note;
  modal.showModal();
}

document.querySelector('[data-open-modal]').addEventListener('click', () => openProductModal(document.querySelector('.product-card')));
document.querySelectorAll('.catalog-card').forEach(card => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Xem chi tiết ${card.querySelector('h3').textContent.trim()}`);
  card.addEventListener('click', event => { if (!event.target.closest('a')) openProductModal(card); });
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProductModal(card); } });
});
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.catalog-card').forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
}));

const form = document.querySelector('#consultForm');
const toast = document.querySelector('.toast');
form.addEventListener('submit', event => {
  event.preventDefault();
  toast.classList.add('show');
  form.reset();
  setTimeout(() => toast.classList.remove('show'), 4000);
});
