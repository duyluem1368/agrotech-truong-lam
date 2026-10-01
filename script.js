const menuButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const modal = document.querySelector('#productModal');
const productKnowledge = {
  'Pitako USA 18.5SC': { active:'Chlorantraniliprole 18,5% w/w · IRAC 28', mechanism:'Điều biến thụ thể Ryanodine', analysis:'Làm giải phóng canxi trong tế bào cơ, sâu ngừng ăn nhanh, co cơ và mất khả năng vận động. Mạnh nhất trên sâu non bộ cánh vảy ở tuổi nhỏ.', targets:['01 · Sâu keo mùa thu trên ngô','02 · Sâu cuốn lá lúa','03 · Sâu đục thân, sâu ăn lá'], note:'Đối tượng đăng ký trên nhãn hiện có: sâu keo mùa thu trên ngô.', atlas:'insect', pos:'0% 0%', pest:'Sâu non bộ cánh vảy – minh họa sâu cuốn lá' },
  'Sharking 25SC': { active:'Chlorantraniliprole 15% + Chlorfenapyr 10% · IRAC 28 + 13', mechanism:'Tác động cơ + phá vỡ tạo năng lượng', analysis:'Hai cơ chế bổ trợ: Chlorantraniliprole làm sâu ngừng ăn; Chlorfenapyr sau hoạt hóa làm gián đoạn tạo ATP. Hữu hiệu với sâu miệng nhai và quần thể khó kiểm soát.', targets:['01 · Sâu keo mùa thu trên ngô','02 · Sâu ăn lá, sâu xanh','03 · Sâu non bộ cánh vảy'], note:'Đối tượng đăng ký trên nhãn: sâu keo trên ngô.', atlas:'insect', pos:'0% 0%', pest:'Sâu miệng nhai – ưu tiên sâu keo và sâu ăn lá' },
  'Cetamiusavb 35WG': { active:'Acetamiprid 15% + Flonicamid 20% · IRAC 4A + 29', mechanism:'Tác động thần kinh + ngừng chích hút', analysis:'Acetamiprid tác động lên thụ thể nicotinic; Flonicamid làm côn trùng ngừng chích hút. Phối hợp phù hợp nhóm chích hút, đặc biệt bọ trĩ và rệp.', targets:['01 · Bọ trĩ trên hoa cúc','02 · Rệp mềm, rầy','03 · Bọ phấn, côn trùng chích hút'], note:'Đối tượng đăng ký trên nhãn: bọ trĩ trên hoa cúc.', atlas:'insect', pos:'50% 100%', pest:'Bọ trĩ và triệu chứng chích hút' },
  'SV-Stellar 30SC': { active:'Clothianidin 30% w/w · IRAC 4A', mechanism:'Chủ vận thụ thể nicotinic acetylcholine', analysis:'Hoạt chất lưu dẫn, tác động tiếp xúc và vị độc lên hệ thần kinh côn trùng. Thích hợp hơn với nhóm chích hút so với sâu lớn miệng nhai.', targets:['01 · Rệp muội, rầy','02 · Bọ phấn','03 · Bọ trĩ'], note:'Cây trồng và đối tượng cụ thể phải đối chiếu đúng nhãn.', atlas:'insect', pos:'50% 0%', pest:'Rầy chích hút trên thân lúa' },
  'Unizeb M-45 80WP': { active:'Mancozeb 80% w/w · FRAC M03', mechanism:'Tiếp xúc đa điểm – phòng bệnh', analysis:'Ức chế nhiều enzyme chứa nhóm sulfhydryl của nấm bệnh. Tác động đa điểm giúp quản lý nguy cơ kháng nhưng cần phủ đều bề mặt trước hoặc sớm khi bệnh xuất hiện.', targets:['01 · Thán thư trên thanh long','02 · Sương mai, mốc sương','03 · Đốm lá do nấm'], note:'Đối tượng đăng ký trên nhãn: thán thư trên thanh long.', atlas:'disease', pos:'50% 0%', pest:'Tổn thương thán thư, đốm lá do nấm' },
  'Mitado 350SC': { active:'Imidacloprid 350 g/L · IRAC 4A', mechanism:'Tác động hệ thần kinh – lưu dẫn', analysis:'Gắn lên thụ thể nicotinic acetylcholine, gây rối loạn dẫn truyền thần kinh. Hữu hiệu chủ yếu với côn trùng chích hút trên đọt và mặt dưới lá.', targets:['01 · Rệp mềm, rầy','02 · Bọ phấn','03 · Bọ trĩ'], note:'Chỉ dùng cho cây trồng, đối tượng và liều lượng ghi trên nhãn.', atlas:'insect', pos:'100% 100%', pest:'Côn trùng chích hút trên đọt non' },
  'TukTuk 20SC': { active:'Lambda-cyhalothrin + Thiamethoxam · IRAC 3A + 4A', mechanism:'Hạ gục tiếp xúc + lưu dẫn thần kinh', analysis:'Pyrethroid tạo hiệu ứng hạ gục nhanh; Thiamethoxam bổ sung tính lưu dẫn với nhóm chích hút. Cần quản lý thiên địch và tránh lặp lại cùng nhóm cơ chế.', targets:['01 · Rầy, rệp, bọ phấn','02 · Bọ trĩ','03 · Sâu ăn lá tuổi nhỏ'], note:'Chưa có đầy đủ mặt sau nhãn; không hiển thị liều dùng.', atlas:'insect', pos:'100% 100%', pest:'Nhóm chích hút trên đọt và lá non' },
  'Nofada 822WP': { active:'Tricyclazole 440 + Isoprothiolane 350 + Hexaconazole 32 g/kg', mechanism:'Ức chế melanin + phospholipid + sterol', analysis:'Ba cơ chế bổ trợ cho bệnh đạo ôn: hạn chế hình thành đĩa áp, cản trở xâm nhiễm và ức chế phát triển sợi nấm. Ưu tiên bảo vệ lá và cổ bông theo đúng nhãn.', targets:['01 · Đạo ôn lá trên lúa','02 · Đạo ôn cổ bông','03 · Nhóm bệnh nấm trên lúa theo nhãn'], note:'Đối tượng đăng ký trên nhãn: đạo ôn trên lúa; thời gian cách ly 14 ngày.', atlas:'disease', pos:'0% 0%', pest:'Vết bệnh đạo ôn hình thoi trên lá lúa' },
  'Masterone 26SC': { active:'Fenoxanil 20% + Kresoxim-methyl 6% · FRAC 16.1 + 11', mechanism:'Ức chế hình thành melanin + hô hấp ty thể', analysis:'Fenoxanil cản trở xâm nhiễm; Kresoxim-methyl chặn truyền electron tại phức hợp III. Phối hợp cho tác động phòng và trị sớm, cần luân phiên nhóm FRAC.', targets:['01 · Thán thư trên cà phê','02 · Đốm lá do nấm','03 · Bệnh nấm giai đoạn xâm nhiễm sớm'], note:'Đối tượng đăng ký trên nhãn: thán thư trên cà phê; cách ly 10 ngày.', atlas:'disease', pos:'100% 100%', pest:'Thán thư trên lá và quả cà phê' }
};

function openProductModal(card) {
  const name = card.querySelector('h3').textContent.trim();
  const image = card.querySelector('img');
  const info = productKnowledge[name] || { targets: ['Liên hệ chuyên viên để đối chiếu nhãn'], note: 'Thông tin đang được cập nhật theo nhãn sản phẩm.' };
  document.querySelector('#modalProductName').textContent = name;
  document.querySelector('#modalProductImage').src = image.src;
  document.querySelector('#modalProductImage').alt = image.alt;
  document.querySelector('#modalActive').textContent = info.active;
  document.querySelector('#modalMechanism').textContent = info.mechanism;
  document.querySelector('#modalAnalysis').textContent = info.analysis;
  document.querySelector('#modalTargets').innerHTML = info.targets.map(target => `<span>${target}</span>`).join('');
  document.querySelector('#modalNote').textContent = info.note;
  const pestImage = document.querySelector('#modalPestImage');
  pestImage.style.backgroundImage = `url("assets/atlas-${info.atlas === 'disease' ? 'benh-hai' : 'con-trung'}-v3.png")`;
  pestImage.style.backgroundPosition = info.pos;
  pestImage.setAttribute('aria-label', info.pest);
  document.querySelector('#modalPestCaption').textContent = info.pest;
  modal.showModal();
}

document.querySelectorAll('.catalog-card').forEach(card => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Xem chi tiết ${card.querySelector('h3').textContent.trim()}`);
  card.addEventListener('click', event => { if (!event.target.closest('a')) openProductModal(card); });
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProductModal(card); } });
});
document.querySelectorAll('.featured-detail').forEach(button => button.addEventListener('click', () => {
  const name = button.closest('[data-featured]').dataset.featured;
  const card = [...document.querySelectorAll('.catalog-card')].find(item => item.querySelector('h3').textContent.trim() === name);
  if (card) openProductModal(card);
}));

let featuredIndex = 0;
const featuredSlides = [...document.querySelectorAll('.featured-slide')];
const featuredDots = [...document.querySelectorAll('.slider-dots button')];
function showFeatured(index) {
  featuredIndex = (index + featuredSlides.length) % featuredSlides.length;
  document.querySelector('.featured-track').style.transform = `translateX(-${featuredIndex * 100}%)`;
  featuredSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === featuredIndex));
  featuredDots.forEach((dot, i) => dot.classList.toggle('active', i === featuredIndex));
}
document.querySelector('.slider-prev').addEventListener('click', () => showFeatured(featuredIndex - 1));
document.querySelector('.slider-next').addEventListener('click', () => showFeatured(featuredIndex + 1));
featuredDots.forEach((dot, i) => dot.addEventListener('click', () => showFeatured(i)));
setInterval(() => showFeatured(featuredIndex + 1), 6500);

const cropLibrary = {
  rice:[['Sâu cuốn lá nhỏ','Lá bị cuốn, phần biểu bì bị cạo trắng','insect','0% 0%'],['Rầy nâu','Chích hút bẹ, gây cháy rầy','insect','50% 0%'],['Đạo ôn','Vết hình thoi, tâm xám, viền nâu','disease','0% 0%']],
  tea:[['Bọ xít muỗi','Chích đọt non, tạo vết thâm','insect','100% 0%'],['Bọ trĩ','Lá non quăn, bề mặt hóa đồng','insect','50% 100%'],['Thán thư chè','Vết nâu lan rộng trên lá','disease','50% 0%']],
  cucumber:[['Bọ trĩ','Hoa, lá non bị chích hút','insect','0% 100%'],['Rệp mềm','Tập trung mặt dưới lá, tiết mật','insect','100% 100%'],['Sương mai','Vết vàng góc cạnh theo gân lá','disease','100% 0%']],
  durian:[['Rệp sáp','Cụm sáp trắng trên trái và cuống','insect','50% 100%'],['Bọ trĩ','Gây sẹo vỏ trái non','insect','0% 100%'],['Phytophthora','Thối trái, xì mủ thân cành','disease','0% 100%']],
  citrus:[['Rầy chổng cánh','Chích hút đọt, môi giới greening','insect','100% 100%'],['Rệp sáp','Bám chùm quả, cuống và cành','insect','50% 100%'],['Loét vi khuẩn','Vết sần có quầng vàng','disease','50% 100%']],
  coffee:[['Rệp sáp','Bám chùm quả, rễ và cành','insect','50% 100%'],['Bọ trĩ','Hại hoa và chồi non','insect','0% 100%'],['Thán thư','Khô cành, đốm lá và quả','disease','100% 100%']]
};
function renderCrop(crop) {
  document.querySelector('#pestLibraryGrid').innerHTML = cropLibrary[crop].map(([name,symptom,atlas,pos]) => `<article class="pest-item"><div class="pest-sprite" style="background-image:url('assets/atlas-${atlas === 'disease' ? 'benh-hai' : 'con-trung'}-v3.png');background-position:${pos}"></div><div><small>${atlas === 'disease' ? 'Bệnh hại' : 'Sâu hại'}</small><h4>${name}</h4><p>${symptom}</p></div></article>`).join('');
}
document.querySelectorAll('[data-crop]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-crop]').forEach(item => item.classList.remove('active')); button.classList.add('active'); renderCrop(button.dataset.crop); }));
renderCrop('rice');
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
