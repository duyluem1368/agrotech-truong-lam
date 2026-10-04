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
  'Sharking 25SC': { active:'Chlorantraniliprole 15% + Chlorfenapyr 10% · IRAC 28 + 13', mechanism:'Tác động cơ + phá vỡ tạo năng lượng', analysis:'Hai cơ chế bổ trợ: Chlorantraniliprole làm sâu ngừng ăn; Chlorfenapyr sau hoạt hóa làm gián đoạn tạo ATP. Hữu hiệu với sâu miệng nhai và quần thể khó kiểm soát.', targets:['01 · Sâu keo mùa thu trên ngô','02 · Sâu cuốn lá lúa','03 · Sâu xanh, sâu ăn lá'], note:'Đối tượng đăng ký trên nhãn: sâu keo trên ngô. Sâu cuốn lá và sâu xanh, sâu ăn lá là nhóm ưu tiên tham khảo theo cơ chế hoạt chất; chỉ sử dụng khi phù hợp hướng dẫn trên nhãn.', atlas:'insect', pos:'0% 0%', pest:'Sâu miệng nhai – ưu tiên sâu keo và sâu ăn lá' },
  'Cetamiusavb 35WG': { active:'Acetamiprid 15% + Flonicamid 20% · IRAC 4A + 29', mechanism:'Tác động thần kinh + ngừng chích hút', analysis:'Acetamiprid tác động lên thụ thể nicotinic; Flonicamid làm côn trùng ngừng chích hút. Phối hợp phù hợp nhóm chích hút, đặc biệt bọ trĩ và rệp.', targets:['01 · Bọ trĩ trên hoa cúc','02 · Rệp mềm','03 · Bọ phấn'], note:'Đối tượng đăng ký trên nhãn: bọ trĩ trên hoa cúc.', atlas:'insect', pos:'50% 100%', pest:'Bọ trĩ và triệu chứng chích hút' },
  'SV-Stellar 30SC': { active:'Clothianidin 30% w/w · IRAC 4A', mechanism:'Chủ vận thụ thể nicotinic acetylcholine', analysis:'Hoạt chất lưu dẫn, tác động tiếp xúc và vị độc lên hệ thần kinh côn trùng. Thích hợp hơn với nhóm chích hút so với sâu lớn miệng nhai.', targets:['01 · Rệp mềm','02 · Rầy nâu','03 · Bọ phấn'], note:'Cây trồng và đối tượng cụ thể phải đối chiếu đúng nhãn.', atlas:'insect', pos:'50% 0%', pest:'Nhóm côn trùng chích hút' },
  'Unizeb M-45 80WP': { active:'Mancozeb 80% w/w · FRAC M03', mechanism:'Tiếp xúc đa điểm – phòng bệnh', analysis:'Ức chế nhiều enzyme chứa nhóm sulfhydryl của nấm bệnh. Tác động đa điểm giúp quản lý nguy cơ kháng nhưng cần phủ đều bề mặt trước hoặc sớm khi bệnh xuất hiện.', targets:['01 · Thán thư trên thanh long','02 · Sương mai, mốc sương','03 · Đốm lá do nấm'], note:'Đối tượng đăng ký trên nhãn: thán thư trên thanh long.', atlas:'disease', pos:'50% 0%', pest:'Tổn thương thán thư, đốm lá do nấm' },
  'IMITADO 350SC': { active:'Imidacloprid 350 g/L · IRAC 4A', mechanism:'Tác động hệ thần kinh – lưu dẫn', analysis:'Gắn lên thụ thể nicotinic acetylcholine, gây rối loạn dẫn truyền thần kinh. Hữu hiệu chủ yếu với côn trùng chích hút trên đọt và mặt dưới lá.', targets:['01 · Rệp mềm','02 · Bọ phấn','03 · Bọ trĩ'], note:'Chỉ dùng cho cây trồng, đối tượng và liều lượng ghi trên nhãn.', atlas:'insect', pos:'100% 100%', pest:'Côn trùng chích hút trên đọt non' },
  'TukTuk 20SC': { active:'Lambda-cyhalothrin + Thiamethoxam · IRAC 3A + 4A', mechanism:'Hạ gục tiếp xúc + lưu dẫn thần kinh', analysis:'Pyrethroid tạo hiệu ứng hạ gục nhanh; Thiamethoxam bổ sung tính lưu dẫn với nhóm chích hút. Cần quản lý thiên địch và tránh lặp lại cùng nhóm cơ chế.', targets:['01 · Rầy nâu','02 · Rệp mềm','03 · Bọ phấn'], note:'Chưa có đầy đủ mặt sau nhãn; không hiển thị liều dùng.', atlas:'insect', pos:'100% 100%', pest:'Nhóm chích hút trên đọt và lá non' },
  'Nofada 822WP': { active:'Tricyclazole 440 + Isoprothiolane 350 + Hexaconazole 32 g/kg', mechanism:'Ức chế melanin + phospholipid + sterol', analysis:'Ba cơ chế bổ trợ cho bệnh đạo ôn: hạn chế hình thành đĩa áp, cản trở xâm nhiễm và ức chế phát triển sợi nấm. Ưu tiên bảo vệ lá và cổ bông theo đúng nhãn.', targets:['01 · Đạo ôn lá trên lúa','02 · Đạo ôn cổ bông','03 · Đạo ôn trên lúa giai đoạn sớm'], note:'Đối tượng đăng ký trên nhãn: đạo ôn trên lúa; thời gian cách ly 14 ngày. Ba mục ưu tiên thể hiện các vị trí và giai đoạn nhận diện của cùng nhóm bệnh đạo ôn.', atlas:'disease', pos:'0% 0%', pest:'Vết bệnh đạo ôn hình thoi trên lá lúa' },
  'Masterone 26SC': { active:'Fenoxanil 20% + Kresoxim-methyl 6% · FRAC 16.1 + 11', mechanism:'Ức chế hình thành melanin + hô hấp ty thể', analysis:'Fenoxanil cản trở xâm nhiễm; Kresoxim-methyl chặn truyền electron tại phức hợp III. Phối hợp cho tác động phòng và trị sớm, cần luân phiên nhóm FRAC.', targets:['01 · Thán thư trên cà phê','02 · Thán thư trên quả cà phê','03 · Đốm lá do nấm'], note:'Đối tượng đăng ký trên nhãn: thán thư trên cà phê; cách ly 10 ngày. Mục 02–03 hỗ trợ nhận diện vị trí và nhóm triệu chứng ưu tiên; sử dụng theo đúng nhãn.', atlas:'disease', pos:'100% 100%', pest:'Thán thư trên lá và quả cà phê' },
  'Rhett 60WG': { active:'Metiram 55% + Pyraclostrobin 5% · FRAC M03 + 11', mechanism:'Tiếp xúc đa điểm + ức chế hô hấp ty thể', analysis:'Metiram tạo lớp bảo vệ tiếp xúc đa điểm, tác động lên nhiều enzyme của nấm bệnh. Pyraclostrobin có tính nội hấp và lưu dẫn, ức chế truyền electron tại phức hợp III. Phối hợp phù hợp cho phòng bệnh và can thiệp sớm; cần luân phiên cơ chế để quản lý kháng.', targets:['01 · Rỉ sắt trên hoa cúc','02 · Đốm lá do nấm','03 · Bệnh nấm trên lá giai đoạn sớm'], note:'Đối tượng đăng ký trên nhãn: rỉ sắt trên hoa cúc. Liều 1,3 kg/ha; lượng nước 500 lít/ha; cách ly 7 ngày. Mục 02–03 là nhóm triệu chứng ưu tiên tham khảo theo cơ chế; chỉ sử dụng khi phù hợp hướng dẫn trên nhãn.', atlas:'disease', pos:'50% 100%', pest:'Rỉ sắt – các ổ bào tử màu vàng cam trên lá' },
  'Matsu Power 12SC': { active:'Chlorfenapyr 9,5% + Lufenuron 2,5% · IRAC 13 + 15', mechanism:'Phá vỡ tạo năng lượng + ức chế tổng hợp chitin', analysis:'Chlorfenapyr được hoạt hóa trong cơ thể côn trùng, làm gián đoạn quá trình tạo ATP; Lufenuron ức chế tạo chitin khiến sâu non không thể lột xác bình thường. Hai cơ chế bổ trợ cho tác động tiếp xúc, vị độc và khả năng kiểm soát kéo dài trên sâu non.', targets:['01 · Sâu keo mùa thu trên ngô','02 · Sâu cuốn lá lúa','03 · Sâu xanh, sâu ăn lá'], note:'Đối tượng đăng ký trên nhãn: sâu keo mùa thu trên ngô. Liều 0,4 lít/ha; lượng nước 500 lít/ha hoặc pha 30 ml cho 18–20 lít nước; phun khi sâu tuổi 1–2; cách ly 14 ngày. Mục 02–03 là nhóm ưu tiên tham khảo; sử dụng theo đúng nhãn.', atlas:'insect', pos:'0% 0%', pest:'Sâu keo mùa thu – sâu non gây hại trong nõn ngô' },
  'Techtimex 50WG': { active:'Emamectin benzoate 49 g/kg + Matrine 1 g/kg · IRAC 6 + hoạt chất sinh học', mechanism:'Kích hoạt kênh chloride + tác động thần kinh đa điểm', analysis:'Emamectin benzoate làm tăng dòng ion chloride qua màng tế bào thần kinh, khiến sâu nhanh ngừng ăn, tê liệt và chết. Matrine có nguồn gốc thảo mộc, bổ sung tác động tiếp xúc và vị độc. Phối hợp phù hợp để kiểm soát sâu non ăn lá và hỗ trợ quản lý tính kháng.', targets:['01 · Sâu cuốn lá trên lúa','02 · Sâu keo mùa thu trên ngô','03 · Sâu xanh, sâu ăn lá'], note:'Đối tượng đăng ký trên nhãn: sâu cuốn lá trên lúa. Liều 100–150 g/ha; lượng nước 400–600 lít/ha; phun khi sâu tuổi 1–2; cách ly 7 ngày. Mục 02–03 là nhóm ưu tiên tham khảo; sử dụng theo đúng nhãn.', atlas:'insect', pos:'0% 0%', pest:'Sâu cuốn lá nhỏ – sâu non cuốn lá và cạo biểu bì lúa' }
  ,'Rocky 150SC': { active:'Bifenthrin 50 g/L + Flonicamid 100 g/L · IRAC 3A + 29', mechanism:'Tác động thần kinh + ngừng chích hút', analysis:'Bifenthrin cho tác động tiếp xúc và vị độc; Flonicamid làm côn trùng chích hút nhanh ngừng ăn. Phối hợp hai cơ chế để kiểm soát nhóm côn trùng chích hút và gây hại trên lá.', targets:['01 · Bọ phấn trắng trên sắn','02 · Bọ trĩ','03 · Rầy xanh'], note:'Đối tượng đăng ký trên nhãn: bọ phấn trắng trên sắn. Liều 0,8 lít/ha; lượng nước 500 lít/ha; phun khi mật độ khoảng 5–7 con/lá; cách ly 14 ngày. Bọ trĩ và rầy xanh là nhóm đối tượng ưu tiên tư vấn; chỉ sử dụng khi phù hợp hướng dẫn trên nhãn.', atlas:'insect', pos:'100% 100%', pest:'Bọ phấn trắng, bọ trĩ và rầy xanh' }
  ,'SAMTAKO 20SC': { active:'Chlorantraniliprole 16% + Indoxacarb 4% · IRAC 28 + 22A', mechanism:'Điều biến thụ thể Ryanodine + chặn kênh natri', analysis:'Chlorantraniliprole làm rối loạn cân bằng canxi trong tế bào cơ; Indoxacarb chặn kênh natri của hệ thần kinh. Sâu nhanh ngừng ăn, bất động rồi chết sau khi tiếp xúc hoặc ăn phải thuốc.', targets:['01 · Sâu keo mùa thu trên ngô','02 · Sâu đục thân','03 · Sâu cuốn lá'], note:'Đối tượng đăng ký trên nhãn: sâu keo mùa thu trên ngô. Liều 0,25 lít/ha; lượng nước 500 lít/ha; phun khi mật độ 1–2 con/cây; cách ly 7 ngày. Sâu đục thân và sâu cuốn lá là nhóm đối tượng ưu tiên tư vấn; chỉ sử dụng khi phù hợp hướng dẫn trên nhãn.', atlas:'insect', pos:'0% 0%', pest:'Sâu keo, sâu đục thân và sâu cuốn lá' }
};

const pestPhotos = {
  'Sâu keo mùa thu trên ngô':'assets/pests/fall-armyworm-larva.jpg',
  'Sâu cuốn lá lúa':'assets/pests/rice-leaf-folder-larva.jpg',
  'Sâu cuốn lá trên lúa':'assets/pests/rice-leaf-folder-larva.jpg',
  'Sâu đục thân, sâu ăn lá':'assets/pests/rice-stem-borer-inside-rice-v2.png',
  'Sâu ăn lá, sâu xanh':'assets/pests/geometer-caterpillar.webp',
  'Sâu xanh, sâu ăn lá':'assets/pests/geometer-caterpillar.webp',
  'Sâu ăn lá tuổi nhỏ':'assets/pests/fall-armyworm-larva.jpg',
  'Sâu non bộ cánh vảy':'assets/pests/fall-armyworm-larva.jpg',
  'Bọ trĩ trên hoa cúc':'assets/pests/thrips.jpg',
  'Bọ trĩ':'assets/pests/thrips.jpg',
  'Sâu đục thân':'assets/pests/rice-stem-borer-inside-rice-v2.png',
  'Sâu cuốn lá':'assets/pests/rice-leaf-folder-larva.jpg',
  'Rệp mềm':'assets/pests/aphid.jpg',
  'Rầy nâu':'assets/pests/brown-planthopper.jpg',
  'Rầy xanh':'assets/pests/tea-green-leafhopper.webp',
  'Bọ phấn, côn trùng chích hút':'assets/pests/cassava-whitefly-v1.png',
  'Bọ phấn':'assets/pests/cassava-whitefly-v1.png',
  'Bọ phấn trắng trên sắn':'assets/pests/cassava-whitefly-v1.png',
  'Bọ nhảy':'assets/pests/flea-beetle-damage-v1.png',
  'Thán thư trên thanh long':'assets/pests/dragon-fruit-anthracnose.webp',
  'Sương mai, mốc sương':'assets/pests/downy-mildew-cucumber.jpg',
  'Đốm lá do nấm':'assets/pests/tea-anthracnose.webp',
  'Rỉ sắt trên hoa cúc':'assets/pests/chrysanthemum-rust-v1.png',
  'Đạo ôn lá trên lúa':'assets/pests/rice-blast.jpg',
  'Đạo ôn cổ bông':'assets/pests/rice-neck-blast.webp',
  'Nhóm bệnh nấm trên lúa theo nhãn':'assets/pests/rice-blast.jpg',
  'Đạo ôn trên lúa giai đoạn sớm':'assets/pests/rice-blast.jpg',
  'Thán thư trên cà phê':'assets/pests/coffee-anthracnose.webp',
  'Thán thư trên quả cà phê':'assets/pests/coffee-anthracnose.webp',
  'Bệnh nấm giai đoạn xâm nhiễm sớm':'assets/pests/coffee-anthracnose.webp',
  'Nhóm bệnh nấm ở giai đoạn mới xuất hiện':'assets/pests/chrysanthemum-rust-v1.png',
  'Bệnh nấm trên lá giai đoạn sớm':'assets/pests/chrysanthemum-rust-v1.png',
  'Bảo vệ lá theo phạm vi ghi trên nhãn':'assets/pests/chrysanthemum-rust-v1.png'
};

const representativeTargets = new Set([
  'Sâu đục thân, sâu ăn lá', 'Sâu ăn lá, sâu xanh', 'Sâu ăn lá tuổi nhỏ', 'Sâu non bộ cánh vảy',
  'Sương mai, mốc sương', 'Đốm lá do nấm', 'Nhóm bệnh nấm trên lúa theo nhãn',
  'Bệnh nấm giai đoạn xâm nhiễm sớm', 'Nhóm bệnh nấm ở giai đoạn mới xuất hiện', 'Bệnh nấm trên lá giai đoạn sớm',
  'Bảo vệ lá theo phạm vi ghi trên nhãn'
]);
const illustrativeTargets = new Set([
  'Sâu đục thân', 'Sâu đục thân, sâu ăn lá', 'Bọ phấn', 'Bọ phấn trắng trên sắn',
  'Bọ nhảy', 'Rỉ sắt trên hoa cúc', 'Nhóm bệnh nấm ở giai đoạn mới xuất hiện',
  'Bảo vệ lá theo phạm vi ghi trên nhãn'
]);

function targetLabel(target) { return target.replace(/^\d+\s*·?\s*/, ''); }

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
  const targetBox = document.querySelector('#modalTargets');
  targetBox.innerHTML = info.targets.map((target, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-target-index="${index}">${target}</button>`).join('');
  document.querySelector('#modalNote').textContent = info.note;
  const pestImage = document.querySelector('#modalPestImage');
  pestImage.style.backgroundImage = `url("assets/atlas-${info.atlas === 'disease' ? 'benh-hai' : 'con-trung'}-v3.png")`;
  pestImage.style.backgroundPosition = info.pos;
  pestImage.setAttribute('aria-label', info.pest);
  document.querySelector('#modalPestCaption').textContent = info.pest;
  const showTarget = (button) => {
    targetBox.querySelectorAll('button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const label = targetLabel(button.textContent);
    pestImage.style.opacity = '.25';
    setTimeout(() => {
      const exactPhoto = pestPhotos[label] || (typeof libraryPhotos !== 'undefined' ? libraryPhotos[label] : null);
      pestImage.style.backgroundImage = exactPhoto ? `url("${exactPhoto}")` : 'none';
      pestImage.style.backgroundSize = exactPhoto ? 'contain' : 'auto';
      pestImage.style.backgroundPosition = 'center';
      pestImage.classList.toggle('photo-pending', !exactPhoto);
      document.querySelector('#modalPestCaption').textContent = exactPhoto
        ? `${label} · ${illustrativeTargets.has(label) ? 'ảnh minh họa sâu gây hại trong thân lúa' : representativeTargets.has(label) ? 'ảnh đại diện cho nhóm đối tượng' : 'ảnh nhận diện đúng đối tượng'}`
        : `${label} · chưa hiển thị ảnh để tránh dùng sai đối tượng`;
      pestImage.setAttribute('aria-label', button.textContent);
      pestImage.style.opacity = '1';
    }, 160);
  };
  targetBox.querySelectorAll('button').forEach(button => button.addEventListener('click', () => showTarget(button)));
  showTarget(targetBox.querySelector('button'));
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
  rice:[['Sâu cuốn lá nhỏ','Lá bị cuốn, phần biểu bì bị cạo trắng','insect','0% 0%'],['Rầy nâu','Chích hút bẹ, gây cháy rầy','insect','50% 0%'],['Sâu đục thân lúa','Dảnh héo hoặc bông bạc, thân có lỗ đục','insect','0% 0%'],['Đạo ôn','Vết hình thoi, tâm xám, viền nâu','disease','0% 0%'],['Đen lép hạt','Vỏ trấu đổi màu, hạt lép hoặc gạo giảm phẩm chất','disease','50% 100%']],
  tea:[['Bọ xít muỗi','Chích đọt non, tạo vết thâm','insect','100% 0%'],['Bọ trĩ','Lá non quăn, bề mặt hóa đồng','insect','50% 100%'],['Rầy xanh','Chích hút búp và lá non, mép lá cháy vàng','insect','50% 0%'],['Thán thư chè','Vết nâu lan rộng trên lá','disease','50% 0%'],['Phồng rộp lá chè','Mặt lá nổi phồng, mặt dưới có ổ bào tử trắng','disease','50% 100%']],
  lychee:[['Bọ xít','Chích hút chồi, hoa và quả non làm rụng','insect','100% 0%'],['Sâu đo','Sâu ăn khuyết lá và lộc non','insect','0% 0%'],['Sâu que','Ẩn giống cành nhỏ, ăn lá và chồi non','insect','0% 0%'],['Thán thư vải','Vết nâu đen trên lá, hoa và quả','disease','100% 100%'],['Sương mai vải','Mốc trắng trên quả, gây thối và rụng quả','disease','100% 0%']],
  cucumber:[['Bọ trĩ','Hoa, lá non bị chích hút','insect','0% 100%'],['Rệp mềm','Tập trung mặt dưới lá, tiết mật','insect','100% 100%'],['Sương mai','Vết vàng góc cạnh theo gân lá','disease','100% 0%']],
  durian:[['Rệp sáp','Cụm sáp trắng trên trái và cuống','insect','50% 100%'],['Bọ trĩ','Gây sẹo vỏ trái non','insect','0% 100%'],['Bệnh vàng lá thối rễ','Lá vàng, rụng dần; rễ thối đen và tuột vỏ','disease','50% 50%'],['Bệnh nứt thân xì mủ','Vỏ thân nứt, chảy nhựa nâu và khô cành','disease','50% 50%'],['Bệnh cháy lá chết ngọn','Mép lá cháy lan vào trong, ngọn non khô chết','disease','50% 50%'],['Bệnh thán thư sầu riêng','Đốm nâu có vòng đồng tâm trên lá, có thể hại hoa và trái','disease','50% 50%'],['Bệnh thối trái sầu riêng','Mảng thối nhũn nâu đen lan nhanh trên vỏ trái','disease','50% 50%']],
  citrus:[['Sâu vẽ bùa cam quýt','Đường hầm ngoằn ngoèo màu trắng bạc trên lá non, lá quăn queo','insect','50% 50%'],['Rầy chổng cánh','Chích hút chồi non và truyền bệnh vàng lá gân xanh','insect','50% 50%'],['Nhện đỏ, nhện vàng cam quýt','Chích hút lá non, hoa và vỏ trái làm lá cằn, vỏ sần rám','insect','50% 50%'],['Rệp sáp và rệp vảy cam quýt','Bám thành cụm ở bẹ lá, cành và quả; tiết mật gây nấm bồ hóng','insect','50% 50%'],['Sâu đục thân, cành và quả cam quýt','Lỗ đục có phân gỗ; cành héo khô, quả rụng non','insect','50% 50%'],['Bệnh vàng lá gân xanh','Lá vàng loang lổ nhưng gân còn xanh, quả nhỏ méo và chín lệch','disease','50% 50%'],['Bệnh Tristeza','Cây lùn, vàng lá, suy kiệt nhanh và có thể lõm gỗ','disease','50% 50%'],['Bệnh thối gốc, chảy mủ cam quýt','Vỏ gốc thối nâu, nứt và chảy nhựa; cây vàng lá, rụng lá','disease','50% 50%'],['Bệnh ghẻ và loét cam quýt','Mụn sần, vết loét trên lá, cành non và vỏ quả','disease','50% 50%'],['Bệnh thán thư cam quýt','Khô cành, rụng hoa; vết nâu lõm trên quả vào mùa mưa','disease','50% 50%']],
  coffee:[['Rệp sáp và rệp vảy cà phê','Bám ở búp, lá non, cành, chùm quả và rễ; tiết mật gây nấm bồ hóng','insect','50% 50%'],['Mọt đục quả cà phê','Lỗ đục nhỏ trên quả, hạt bị rỗng và giảm chất lượng','insect','50% 50%'],['Mọt đục cành, đục thân cà phê','Lỗ đục có mùn cưa; cành héo khô hoặc gãy','insect','50% 50%'],['Tuyến trùng hại rễ cà phê','Rễ có nốt sần, thối; lá vàng và cây héo rũ','insect','50% 50%'],['Bệnh rỉ sắt cà phê','Đốm vàng cam như bột sắt ở mặt dưới lá','disease','50% 50%'],['Bệnh thán thư cà phê','Vết thâm tròn trên lá, cành và quả; quả khô đen, rụng','disease','50% 50%'],['Bệnh nấm hồng cà phê','Lớp nấm màu hồng trên vỏ cành, làm cành nứt và chết khô','disease','50% 50%']]
};
const cropNames = {rice:'Lúa',tea:'Chè',lychee:'Vải',cucumber:'Dưa chuột',durian:'Sầu riêng',citrus:'Cam, quýt',coffee:'Cà phê'};
const libraryPhotos = {
  'Sâu cuốn lá nhỏ':'assets/pests/rice-leaf-folder-larva.jpg',
  'Rầy nâu':'assets/pests/brown-planthopper.jpg',
  'Sâu đục thân lúa':'assets/pests/rice-stem-borer-inside-rice-v2.png',
  'Đạo ôn':'assets/pests/rice-blast.jpg',
  'Đen lép hạt':'assets/pests/rice-grain-discoloration.webp',
  'Bọ xít muỗi':'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Tea_Mosquito_Bug_%28Helopeltis_Theivora%29_%2835811112746%29.jpg/500px-Tea_Mosquito_Bug_%28Helopeltis_Theivora%29_%2835811112746%29.jpg?utm_source=commons.wikimedia.org',
  'Bọ trĩ':'assets/pests/thrips.jpg',
  'Rầy xanh':'assets/pests/tea-green-leafhopper.webp',
  'Thán thư chè':'assets/pests/tea-anthracnose.webp',
  'Phồng rộp lá chè':'assets/pests/tea-blister-blight.webp',
  'Bọ xít':'assets/pests/litchi-stink-bug.webp',
  'Sâu đo':'assets/pests/geometer-caterpillar.webp',
  'Sâu que':'assets/pests/litchi-stick-caterpillar.webp',
  'Thán thư vải':'assets/pests/litchi-anthracnose.webp',
  'Sương mai vải':'assets/pests/litchi-downy-blight.webp',
  'Rệp mềm':'assets/pests/aphid.jpg',
  'Sương mai':'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Downy_mildew_on_leaves_of_Cucumis_sativus.jpg/500px-Downy_mildew_on_leaves_of_Cucumis_sativus.jpg?utm_source=commons.wikimedia.org',
  'Rệp sáp':'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Long-fringed_Astelia_Mealybug_%28Rastrococcus_asteliae%29.jpg/500px-Long-fringed_Astelia_Mealybug_%28Rastrococcus_asteliae%29.jpg?utm_source=commons.wikimedia.org',
  'Phytophthora':'assets/pests/durian-phytophthora.webp',
  'Bệnh vàng lá thối rễ':'assets/pests/durian-yellow-leaf-root-rot.webp',
  'Bệnh nứt thân xì mủ':'assets/pests/durian-stem-canker-gummosis.webp',
  'Bệnh cháy lá chết ngọn':'assets/pests/durian-leaf-blight-dieback.webp',
  'Bệnh thán thư sầu riêng':'assets/pests/durian-anthracnose.webp',
  'Bệnh thối trái sầu riêng':'assets/pests/durian-fruit-rot.webp',
  'Rầy chổng cánh':'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Asian_citrus_psyllid_%28Diaphorina_citri%29_on_Citrus_%C3%97_aurantiifolia.jpg/500px-Asian_citrus_psyllid_%28Diaphorina_citri%29_on_Citrus_%C3%97_aurantiifolia.jpg?utm_source=commons.wikimedia.org',
  'Loét vi khuẩn':'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Citrus_canker_on_foliage.jpg/500px-Citrus_canker_on_foliage.jpg?utm_source=commons.wikimedia.org',
  'Sâu vẽ bùa cam quýt':'assets/pests/citrus-leaf-miner.webp',
  'Nhện đỏ, nhện vàng cam quýt':'assets/pests/citrus-red-yellow-mites.webp',
  'Rệp sáp và rệp vảy cam quýt':'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Long-fringed_Astelia_Mealybug_%28Rastrococcus_asteliae%29.jpg/500px-Long-fringed_Astelia_Mealybug_%28Rastrococcus_asteliae%29.jpg?utm_source=commons.wikimedia.org',
  'Sâu đục thân, cành và quả cam quýt':'assets/pests/citrus-trunk-fruit-borer.webp',
  'Bệnh vàng lá gân xanh':'assets/pests/citrus-greening.webp',
  'Bệnh Tristeza':'assets/pests/citrus-tristeza.webp',
  'Bệnh thối gốc, chảy mủ cam quýt':'assets/pests/citrus-foot-rot-gummosis.webp',
  'Bệnh ghẻ và loét cam quýt':'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Citrus_canker_on_foliage.jpg/500px-Citrus_canker_on_foliage.jpg?utm_source=commons.wikimedia.org',
  'Bệnh thán thư cam quýt':'assets/pests/citrus-anthracnose.webp',
  'Thán thư':'assets/pests/coffee-anthracnose.webp'
  ,'Rệp sáp và rệp vảy cà phê':'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Long-fringed_Astelia_Mealybug_%28Rastrococcus_asteliae%29.jpg/500px-Long-fringed_Astelia_Mealybug_%28Rastrococcus_asteliae%29.jpg?utm_source=commons.wikimedia.org'
  ,'Mọt đục quả cà phê':'assets/pests/coffee-berry-borer.webp'
  ,'Mọt đục cành, đục thân cà phê':'assets/pests/coffee-twig-stem-borer.webp'
  ,'Tuyến trùng hại rễ cà phê':'assets/pests/coffee-root-knot-nematode.webp'
  ,'Bệnh rỉ sắt cà phê':'assets/pests/coffee-leaf-rust.webp'
  ,'Bệnh thán thư cà phê':'assets/pests/coffee-anthracnose.webp'
  ,'Bệnh nấm hồng cà phê':'assets/pests/coffee-pink-disease.webp'
};
const pestDetails = {
  'Sâu cuốn lá nhỏ':['Bướm hoạt động về đêm, đẻ trứng rải rác trên lá; sâu non thường trải qua 5 tuổi và phát triển mạnh trong ruộng xanh tốt, ẩm độ cao.','Sâu non nhả tơ cuốn dọc lá lúa, sống bên trong và cạo biểu bì làm lá thành vệt trắng; hại nặng làm giảm diện tích quang hợp.','Vệ sinh đồng ruộng, bón đạm cân đối, bảo vệ thiên địch và thăm đồng để xử lý khi sâu tuổi nhỏ đạt ngưỡng. Chỉ dùng thuốc đăng ký cho sâu cuốn lá trên lúa.'],
  'Rầy nâu':['Trứng được đẻ trong mô bẹ lá; rầy non và trưởng thành tập trung ở gốc lúa. Quần thể tăng nhanh trong ruộng rậm, bón thừa đạm và thời tiết nóng ẩm.','Chích hút nhựa ở bẹ, mật số cao gây vàng và cháy rầy; đồng thời có thể truyền virus vàng lùn, lùn xoắn lá.','Gieo sạ đồng loạt, mật độ hợp lý, bón phân cân đối, giữ thiên địch và kiểm tra sát gốc. Chỉ xử lý khi đạt ngưỡng, dùng thuốc đúng nhãn và tránh phun tràn lan.'],
  'Đạo ôn':['Nấm sinh nhiều bào tử trong điều kiện mát, ẩm, sương kéo dài; phát tán theo gió và nước. Ruộng bón thừa đạm, giống nhiễm dễ bùng phát.','Tạo vết hình thoi tâm xám trên lá; có thể hại đốt thân, cổ bông làm lép hạt hoặc gãy cổ bông.','Dùng giống khỏe, xử lý hạt, bón cân đối và tránh thừa đạm. Theo dõi thời tiết, loại bỏ nguồn bệnh và dùng thuốc đăng ký ở giai đoạn sớm theo đúng nhãn.'],
  'Sâu đục thân lúa':['Bướm đẻ trứng thành ổ trên lá; sâu non nở ra bò xuống bẹ rồi đục vào thân. Nhiều lứa có thể nối tiếp trong vụ, thường tăng sau các đợt bướm rộ.','Giai đoạn đẻ nhánh gây dảnh héo; giai đoạn làm đòng đến trỗ gây bông bạc, hạt lép. Trên thân thường có lỗ đục và phân sâu.','Vệ sinh gốc rạ, gieo cấy đồng loạt, bón đạm cân đối và theo dõi bướm, ổ trứng. Bảo vệ thiên địch; chỉ xử lý bằng thuốc đăng ký khi sâu non mới nở, trước khi chui vào thân.'],
  'Đen lép hạt':['Bệnh do một phức hợp nấm và vi khuẩn liên quan, dễ phát triển khi trỗ gặp mưa ẩm, nhiệt độ cao, ruộng rậm hoặc cây bị sâu bệnh làm tổn thương.','Vỏ trấu xuất hiện chấm hoặc mảng nâu đen; hạt lép, lửng, gạo biến màu và giảm tỷ lệ nảy mầm cũng như phẩm chất.','Dùng giống sạch, xử lý hạt giống, gieo cấy đúng thời vụ, bón cân đối và quản lý tốt sâu bệnh ở giai đoạn làm đòng–trỗ. Giữ ruộng thông thoáng và dùng sản phẩm có đăng ký theo dự báo, đúng nhãn.'],
  'Bọ xít muỗi':['Thành trùng và ấu trùng ưa tán chè non, hoạt động mạnh sáng sớm hoặc chiều mát; mật số thường tăng trong điều kiện ẩm và tán rậm.','Chích hút búp và lá non tạo chấm thâm, mô quanh vết chích khô đen; búp biến dạng, giảm năng suất và chất lượng chè.','Tỉa tán thông thoáng, thu hái đúng lứa, vệ sinh cỏ ký chủ và bảo vệ thiên địch. Theo dõi búp non, chỉ dùng thuốc được đăng ký khi mật số vượt ngưỡng.'],
  'Bọ trĩ':['Cơ thể rất nhỏ, sống kín trong búp, hoa hoặc mặt dưới lá; vòng đời ngắn nên tăng mật số nhanh khi khô nóng.','Chích hút làm lá non xoăn, bạc hoặc hóa đồng; trên hoa và quả non gây sẹo, giảm chất lượng thương phẩm.','Vệ sinh vườn, tưới đủ ẩm, dùng bẫy dính và bảo vệ thiên địch. Luân phiên hoạt chất khác nhóm cơ chế, phun đúng vị trí cư trú và đúng nhãn.'],
  'Thán thư chè':['Nấm tồn tại trên lá, cành bệnh và phát tán nhờ mưa; phát triển thuận lợi khi tán ẩm, mưa kéo dài và cây suy yếu.','Vết nâu từ mép hoặc chóp lá lan rộng, có thể xuất hiện chấm đen; lá khô rụng, cành non suy giảm.','Thu gom lá bệnh, tỉa tán thoáng, bón cân đối và hạn chế làm lá ướt kéo dài. Sử dụng thuốc trừ bệnh có đăng ký ở giai đoạn sớm.'],
  'Rầy xanh':['Trứng được đẻ trong mô non; rầy non và trưởng thành sống ở mặt dưới lá, di chuyển nhanh và phát triển mạnh trong lứa chè non, thời tiết khô ấm.','Chích hút làm búp chậm lớn, mép lá cong xuống rồi cháy vàng hoặc nâu; mật số cao làm giảm năng suất và chất lượng búp.','Thu hái đúng lứa, tỉa tán thông thoáng, quản lý cỏ ký chủ và bảo vệ thiên địch. Theo dõi mặt dưới lá non, chỉ xử lý bằng thuốc có đăng ký khi mật số đạt ngưỡng.'],
  'Phồng rộp lá chè':['Nấm phát triển thuận lợi trong điều kiện mát, ẩm, sương mù và tán chè rậm; bào tử phát tán theo gió, mưa và xâm nhiễm lá non.','Ban đầu có chấm trong dầu, sau đó mặt trên lá phồng lên; mặt dưới xuất hiện lớp bào tử trắng. Bệnh nặng làm lá biến dạng, khô và giảm búp.','Tỉa tán, làm cỏ và thoát ẩm; thu hái, tiêu hủy lá bệnh sớm, bón phân cân đối. Theo dõi thời tiết và dùng thuốc trừ bệnh có đăng ký ngay từ giai đoạn đầu.'],
  'Bọ xít':['Trứng thường được đẻ thành ổ trên lá; bọ non và trưởng thành chích hút mạnh từ thời kỳ ra lộc, ra hoa đến quả non. Chúng có thể trú trên tán cây và cây ký chủ quanh vườn.','Vết chích làm chồi héo, hoa và quả non rụng; trên quả lớn có thể tạo vết thâm, chai cứng, ảnh hưởng mẫu mã và năng suất.','Vệ sinh vườn, phát quang cây ký chủ, thu gom ổ trứng và bắt bọ vào sáng sớm. Bảo vệ thiên địch; theo dõi tán cây và dùng thuốc đăng ký đúng thời điểm khi mật số tăng.'],
  'Sâu đo':['Bướm hoạt động ban đêm; sâu non có cách di chuyển co–duỗi như đo chiều dài cành. Sâu phát triển nhanh trong các đợt lộc non.','Sâu non ăn khuyết mép lá, lá non và đôi khi cả chùm hoa; mật số cao có thể làm trơ cành, giảm quang hợp và ảnh hưởng đậu quả.','Tỉa tán, vệ sinh vườn và kiểm tra lộc non; bắt sâu, dùng bẫy đèn hợp lý và bảo vệ thiên địch. Nếu cần xử lý, ưu tiên khi sâu còn nhỏ và dùng thuốc đúng nhãn.'],
  'Sâu que':['Sâu có thân dài, màu sắc và tư thế giống cành nhỏ nên khó phát hiện; thường hoạt động về đêm và ẩn trên cành vào ban ngày.','Ăn lá, lộc non và chùm hoa; khi mật số cao có thể làm trụi lá từng cành, cây suy và giảm khả năng nuôi quả.','Thăm vườn vào sáng sớm hoặc chiều tối, rung cành kiểm tra, tỉa tán và thu gom sâu. Bảo vệ thiên địch; chỉ dùng thuốc có đăng ký khi cần thiết, xử lý lúc sâu tuổi nhỏ.'],
  'Thán thư vải':['Nấm tồn tại trên cành, lá và quả bệnh; bào tử phát tán mạnh theo mưa, nhất là khi vườn ẩm, tán rậm và quả đang phát triển.','Gây đốm nâu đen trên lá, khô chùm hoa và vết lõm sẫm trên quả; bệnh có thể tiếp tục phát triển sau thu hoạch làm thối quả.','Tỉa tán thông thoáng, thu gom nguồn bệnh, quản lý dinh dưỡng cân đối và tránh làm ướt tán kéo dài. Phòng sớm ở giai đoạn nguy cơ bằng thuốc có đăng ký, luân phiên nhóm cơ chế.'],
  'Sương mai vải':['Tác nhân Phytophthora phát triển mạnh trong điều kiện mưa ẩm, sương nhiều và tán quả bí; bào tử lan theo nước và gió.','Trên quả xuất hiện vùng nâu, ẩm rồi phủ lớp mốc trắng; quả nhanh thối và rụng. Hoa, chùm quả và lộc non cũng có thể bị cháy.','Tỉa tán, thoát nước, vệ sinh chùm quả bệnh và thu hoạch đúng độ chín. Theo dõi thời tiết, phòng từ sớm bằng sản phẩm có đăng ký và luân phiên cơ chế để hạn chế kháng.'],
  'Rệp mềm':['Sinh sản nhanh, nhiều loài đẻ con không qua giao phối; tập trung thành cụm ở đọt và mặt dưới lá, phát triển mạnh khi thời tiết mát khô.','Chích hút làm lá quăn, cây còi; tiết mật ngọt gây nấm bồ hóng và có thể truyền virus.','Loại bỏ ổ rệp, quản lý cỏ ký chủ, dùng vòi nước hoặc biện pháp sinh học, bảo vệ bọ rùa và ong ký sinh. Khi cần, chọn thuốc lưu dẫn có đăng ký.'],
  'Sương mai':['Tác nhân tạo bào tử mạnh khi lá ướt lâu, ẩm độ cao và nhiệt độ mát; lan nhanh qua nước mưa, gió và tàn dư bệnh.','Vết vàng góc cạnh bị giới hạn bởi gân lá; mặt dưới có lớp mốc, lá cháy và giảm quang hợp.','Luân canh, làm giàn thông thoáng, tưới gốc vào buổi sáng, loại bỏ lá bệnh. Phòng sớm bằng sản phẩm đăng ký và luân phiên nhóm cơ chế.'],
  'Rệp sáp':['Rệp phủ sáp trắng, trú ở khe cuống, chùm quả, cành hoặc rễ; thường được kiến bảo vệ và phát tán qua cây giống, dụng cụ.','Chích hút làm cây suy, quả kém phát triển; mật ngọt tạo nấm bồ hóng và che phủ bề mặt lá, quả.','Kiểm soát kiến, tỉa cành thoáng, vệ sinh cây giống và bảo vệ thiên địch. Xử lý sớm khi ổ rệp còn nhỏ, bảo đảm thuốc tiếp xúc được vị trí ẩn nấp.'],
  'Phytophthora':['Mầm bệnh tồn tại trong đất và tàn dư, tạo bào tử di động theo nước; bùng phát khi mưa nhiều, úng và thoát nước kém.','Gây thối rễ, xì mủ thân cành và thối trái; mô bệnh nâu sẫm, ẩm, lan nhanh và có thể làm chết cây.','Làm mô cao, thoát nước tốt, tránh gây vết thương và không để trái chạm đất. Cạo bỏ mô bệnh đúng kỹ thuật, khử trùng dụng cụ và dùng thuốc đăng ký theo khuyến cáo.'],
  'Bệnh vàng lá thối rễ':['Bệnh thường liên quan đến nấm Phytophthora, Fusarium và có thể nặng hơn khi tuyến trùng gây tổn thương bộ rễ. Đất úng, bí chặt và mưa kéo dài làm bệnh phát triển nhanh.','Rễ tơ chuyển nâu đen, thối mềm và tuột vỏ nên cây hút nước, dinh dưỡng kém. Lá vàng từ từ, rụng dần, cây suy kiệt và có thể chết.','Khơi rãnh thoát nước, cải tạo đất và hạn chế làm tổn thương rễ. Loại bỏ rễ thối, xử lý nguồn bệnh và tuyến trùng theo kết quả chẩn đoán; chỉ dùng sản phẩm có đăng ký, đúng nhãn.'],
  'Bệnh nứt thân xì mủ':['Nấm Phytophthora palmivora tồn tại trong đất và mô bệnh, phát tán theo nước mưa. Bệnh dễ xâm nhập qua vết thương trên thân, cành trong điều kiện vườn ẩm và thoát nước kém.','Vỏ thân hoặc cành lớn xuất hiện vùng sẫm màu, nứt và rỉ nhựa nâu. Phần gỗ bên dưới hóa nâu; vết bệnh bao quanh cành có thể làm khô cành hoặc chết cây.','Giữ vườn thông thoáng, thoát nước tốt và tránh gây vết thương. Cạo bỏ mô bệnh đúng kỹ thuật, thu gom tiêu hủy, sát trùng dụng cụ và dùng thuốc đăng ký theo hướng dẫn chuyên môn.'],
  'Bệnh cháy lá chết ngọn':['Tác nhân bệnh phát triển thuận lợi khi mưa ẩm kéo dài, tán cây rậm và lá ướt lâu. Bào tử có thể lan theo nước mưa, gió và dụng cụ chăm sóc.','Đầu hoặc mép lá chuyển nâu rồi cháy lan vào trong; lá quăn, khô và rụng. Khi bệnh lan đến chồi non, phần ngọn khô đen và chết dần xuống cành.','Tỉa tán cho thoáng, thoát nước, hạn chế tưới làm ướt lá và cắt bỏ cành bệnh. Khử trùng dụng cụ; xác định đúng tác nhân trước khi dùng thuốc trừ bệnh có đăng ký.'],
  'Bệnh thán thư sầu riêng':['Nấm gây bệnh tồn tại trên lá, cành và tàn dư; bào tử lan mạnh trong mưa ẩm. Tán rậm, cây suy yếu và mô non làm nguy cơ bệnh tăng cao.','Lá có các đốm nâu, thường thấy vòng tròn đồng tâm và quầng vàng; vết bệnh có thể liên kết làm cháy lá. Bệnh còn có thể gây khô hoa và thối trái khi ẩm ướt.','Cắt bỏ bộ phận bệnh, tỉa tán thông thoáng, thu gom tàn dư và bón phân cân đối. Theo dõi từ khi ra đọt, ra hoa; dùng thuốc có đăng ký và luân phiên nhóm cơ chế khi cần.'],
  'Bệnh thối trái sầu riêng':['Phytophthora phát triển và phát tán rất nhanh theo nước trong mùa mưa, đặc biệt khi vườn ẩm, trái gần mặt đất hoặc vỏ trái bị xây xát.','Trên vỏ trái xuất hiện mảng úng nước màu nâu, sau chuyển nâu đen và thối nhũn; vết bệnh lan nhanh, có thể có tơ nấm trắng và làm rụng trái trước thu hoạch.','Tạo tán thoáng, thoát nước, kê hoặc treo trái tránh đất và loại bỏ trái bệnh khỏi vườn. Hạn chế làm xây xát; phòng sớm bằng sản phẩm có đăng ký, đúng nhãn và luân phiên cơ chế.'],
  'Rầy chổng cánh':['Trưởng thành đẻ trứng trên đọt non; ấu trùng sống tập trung trên chồi. Mật số tăng theo các đợt ra lộc và chúng là môi giới truyền bệnh greening.','Chích hút làm đọt cong, lá biến dạng; nguy hiểm nhất là truyền vi khuẩn gây vàng lá gân xanh.','Dùng cây giống sạch bệnh, quản lý cây ký chủ, tỉa bỏ cây bệnh và theo dõi đồng loạt các đợt lộc. Bảo vệ thiên địch, xử lý rầy trên đọt non theo đúng nhãn.'],
  'Loét vi khuẩn':['Vi khuẩn xâm nhập qua khí khổng và vết thương, phát tán bởi mưa gió, dụng cụ và cây giống; nặng hơn trong mùa mưa bão.','Vết sần nâu có quầng vàng trên lá, cành và quả; gây rụng lá, giảm phẩm chất và là nguồn lây lan.','Dùng giống sạch, chắn gió, tỉa tiêu hủy cành bệnh, khử trùng dụng cụ và hạn chế gây xây xát. Áp dụng sản phẩm có đăng ký theo hướng dẫn địa phương.'],
  'Sâu vẽ bùa cam quýt':['Bướm nhỏ đẻ trứng trên lá non; sâu non nở ra đục ngay dưới lớp biểu bì. Mật số thường tăng mạnh theo các đợt lộc non.','Đường đục ngoằn ngoèo màu trắng bạc làm lá quăn, biến dạng và giảm quang hợp; vết thương còn tạo cửa ngõ cho vi khuẩn gây bệnh loét.','Tỉa cành cho ra lộc tập trung, chăm cây khỏe và bảo vệ ong ký sinh. Theo dõi lá non, chỉ xử lý bằng sản phẩm có đăng ký khi sâu còn nhỏ và chưa đục sâu.'],
  'Nhện đỏ, nhện vàng cam quýt':['Nhện có kích thước rất nhỏ, sống ở mặt dưới lá, trên hoa và vỏ trái. Quần thể tăng nhanh trong thời tiết khô nóng, vườn nhiều bụi và dùng thuốc phổ rộng kéo dài.','Chích hút tạo chấm vàng li ti, làm lá cằn cỗi; vỏ quả bị rám, sần như da cá nhám, giảm mẫu mã và có thể rụng khi bị hại nặng.','Giữ ẩm hợp lý, giảm bụi, tỉa tán và bảo vệ nhện bắt mồi. Kiểm tra bằng kính lúp; khi vượt ngưỡng, dùng thuốc trừ nhện có đăng ký và luân phiên cơ chế tác động.'],
  'Rệp sáp và rệp vảy cam quýt':['Rệp bám thành cụm ở bẹ lá, cành, cuống và quả; thường được kiến bảo vệ. Chúng phát tán qua cây giống, dụng cụ và các bộ phận cây tiếp xúc nhau.','Chích hút làm lá, quả suy yếu và rụng; mật ngọt tạo lớp nấm bồ hóng đen, cản quang hợp và làm giảm chất lượng quả.','Tỉa tán, kiểm soát kiến, vệ sinh cây giống và bảo vệ thiên địch. Xử lý sớm ổ rệp, bảo đảm sản phẩm có đăng ký tiếp xúc được vị trí ẩn dưới lớp sáp.'],
  'Sâu đục thân, cành và quả cam quýt':['Ấu trùng hoặc mọt đục qua vỏ vào phần gỗ thân, cành hay mô quả. Cây suy yếu, cành tổn thương và vườn ít được vệ sinh thường dễ bị tấn công.','Lỗ đục có phân gỗ hoặc mùn cưa; đường hầm làm cành héo khô, dễ gãy. Trên quả, lỗ đục làm quả rụng non hoặc thối tiếp phát.','Cắt bỏ cành bị đục xuống dưới đường hầm và tiêu hủy; bắt sâu, vệ sinh vườn, quét bảo vệ thân đúng kỹ thuật. Theo dõi lỗ mới và dùng biện pháp có đăng ký theo khuyến cáo địa phương.'],
  'Bệnh vàng lá gân xanh':['Bệnh do vi khuẩn Candidatus Liberibacter asiaticus, chủ yếu được truyền bởi rầy chổng cánh và cây giống nhiễm bệnh. Hiện chưa có biện pháp chữa khỏi cây đã nhiễm.','Lá vàng loang lổ không đối xứng nhưng gân còn xanh; chồi mọc dựng, cây còi. Quả nhỏ, méo, chín lệch màu, hạt lép và có vị đắng.','Dùng cây giống sạch bệnh, kiểm soát rầy đồng loạt khi cây ra lộc và loại bỏ sớm cây xác định nhiễm bệnh. Quản lý cây ký chủ, vệ sinh dụng cụ và không nhân giống từ cây nghi bệnh.'],
  'Bệnh Tristeza':['Virus Citrus tristeza virus được truyền chủ yếu qua rầy mềm và mắt ghép, cây giống nhiễm. Mức độ bệnh phụ thuộc chủng virus, giống và tổ hợp gốc ghép.','Cây sinh trưởng kém, lá vàng, tán thưa và suy kiệt nhanh; một số trường hợp có lõm gỗ trên thân, cành, quả nhỏ và giảm năng suất.','Dùng vật liệu nhân giống sạch virus, gốc ghép chống chịu phù hợp và kiểm soát rầy mềm. Loại bỏ cây bệnh nặng, khử trùng dụng cụ ghép và không lấy mắt ghép từ vườn nhiễm.'],
  'Bệnh thối gốc, chảy mủ cam quýt':['Nấm Phytophthora sống trong đất ẩm, phát tán theo nước và xâm nhập qua vết thương ở gốc, rễ hoặc thân. Đất úng và cổ rễ bị lấp sâu làm bệnh nặng hơn.','Vỏ gốc thối nâu, nứt và chảy nhựa; phần gỗ bên dưới đổi màu. Rễ hư làm lá vàng, rụng, cây suy và có thể chết nếu vết bệnh bao quanh gốc.','Trồng cao, để cổ rễ thông thoáng, thoát nước tốt và tránh gây vết thương. Cạo xử lý mô bệnh đúng kỹ thuật, khử trùng dụng cụ và dùng sản phẩm có đăng ký theo hướng dẫn.'],
  'Bệnh ghẻ và loét cam quýt':['Bệnh ghẻ thường do nấm, còn bệnh loét do vi khuẩn; cả hai phát triển mạnh trên mô non trong điều kiện mưa ẩm. Mưa gió và vết thương giúp bệnh loét lan nhanh.','Ghẻ tạo mụn sần, sẹo méo trên lá và quả; loét tạo vết sần nâu có quầng vàng trên lá, cành và quả. Cả hai làm giảm mẫu mã và có thể gây rụng.','Dùng cây giống sạch, tỉa tán, chắn gió và tiêu hủy bộ phận bệnh. Hạn chế gây xây xát, khử trùng dụng cụ và dùng sản phẩm đăng ký phù hợp với đúng tác nhân.'],
  'Bệnh thán thư cam quýt':['Nấm Colletotrichum tồn tại trên cành, lá và quả bệnh; bào tử lan theo mưa. Bệnh thường tăng khi mưa ẩm kéo dài và cây suy yếu.','Gây khô cành, cháy lá, rụng hoa; trên quả xuất hiện vết nâu sẫm, lõm, có thể mang chấm bào tử màu hồng cam và lan thành thối quả.','Tỉa bỏ cành bệnh, thu gom quả hỏng, làm tán thông thoáng và bón phân cân đối. Theo dõi mùa mưa, dùng thuốc có đăng ký và luân phiên nhóm cơ chế khi cần.'],
  'Thán thư':['Nấm tồn tại trên cành, lá, quả bệnh; bào tử phát tán theo mưa và phát triển mạnh khi ẩm cao, cây mang nhiều quả hoặc suy yếu.','Gây đốm lá, khô cành và vết lõm sẫm trên quả; có thể làm rụng quả non và khô chùm quả.','Tỉa cành thông thoáng, thu gom nguồn bệnh, dinh dưỡng cân đối và tránh tưới ướt tán. Phòng ở thời kỳ nguy cơ và luân phiên thuốc đăng ký khác nhóm FRAC.']
  ,'Rệp sáp và rệp vảy cà phê':['Rệp sống thành cụm ở búp, lá non, cành, chùm quả hoặc vùng rễ; thường được kiến bảo vệ và phát tán qua cây giống, dụng cụ chăm sóc.','Chích hút nhựa làm cây còi cọc, quả non rụng; dịch mật tạo điều kiện cho nấm bồ hóng phát triển, che phủ lá và quả.','Tỉa cành thông thoáng, kiểm soát kiến, làm sạch cây giống và bảo vệ thiên địch. Xử lý sớm ổ rệp, bảo đảm thuốc có đăng ký tiếp xúc được vị trí rệp ẩn nấp.']
  ,'Mọt đục quả cà phê':['Mọt cái Hypothenemus hampei khoét lỗ nhỏ vào quả rồi sinh sản trong hạt. Mọt có thể tồn tại trong quả khô còn trên cây hoặc rơi dưới đất giữa hai vụ.','Hạt bị đục thành đường hầm, chứa phân mọt và ấu trùng; quả non có thể rụng, quả già cho nhân lép, giảm khối lượng và chất lượng sau thu hoạch.','Thu hoạch tập trung, hái vét quả còn sót và thu gom quả rụng để cắt nguồn lưu tồn. Theo dõi lỗ đục, dùng bẫy và biện pháp sinh học; chỉ dùng thuốc có đăng ký đúng thời điểm mọt chưa vào sâu trong hạt.']
  ,'Mọt đục cành, đục thân cà phê':['Mọt trưởng thành đục lỗ vào cành hoặc thân để tạo đường hầm và nuôi nấm cộng sinh làm thức ăn. Cây suy, vườn rậm và cành bị tổn thương dễ bị tấn công.','Miệng lỗ thường có mùn cưa hoặc dịch; phần cành phía trên héo, lá khô nhưng còn treo. Đường đục làm yếu cành, dễ gãy và có thể khiến cây chết chậm.','Cắt cành bị đục xuống dưới đường hầm rồi mang ra khỏi vườn tiêu hủy; tỉa tán, bón cân đối và giữ cây khỏe. Theo dõi lỗ mới, xử lý bằng biện pháp và sản phẩm có đăng ký theo khuyến cáo địa phương.']
  ,'Tuyến trùng hại rễ cà phê':['Tuyến trùng ký sinh trong hoặc ngoài rễ, sinh sản mạnh ở đất ẩm và vườn trồng liên tục. Chúng gây vết thương, tạo điều kiện cho nấm đất xâm nhập làm thối rễ.','Rễ tơ giảm, có nốt sần hoặc vùng hoại tử nâu đen; cây hút nước và dinh dưỡng kém nên lá vàng, sinh trưởng yếu, héo khi nắng và giảm năng suất.','Dùng cây giống sạch, cải tạo đất bằng hữu cơ hoai mục, tăng thoát nước và hạn chế mang đất nhiễm sang khu khác. Cần xét nghiệm rễ/đất để xác định; dùng chế phẩm hoặc thuốc có đăng ký đúng hướng dẫn.']
  ,'Bệnh rỉ sắt cà phê':['Nấm Hemileia vastatrix phát tán bằng bào tử theo gió và mưa; phát triển thuận lợi khi lá ướt lâu, ẩm độ cao và tán cây rậm.','Mặt trên lá có đốm vàng nhạt, mặt dưới hình thành lớp bột vàng cam đặc trưng. Vết bệnh liên kết làm lá khô cháy, rụng sớm và cây suy kiệt.','Dùng giống phù hợp, tỉa tán, điều chỉnh cây che bóng và bón phân cân đối. Thu gom lá bệnh nặng, theo dõi đầu mùa mưa và dùng thuốc có đăng ký, luân phiên nhóm cơ chế khi cần.']
  ,'Bệnh thán thư cà phê':['Nấm Colletotrichum tồn tại trên cành, lá và quả bệnh; bào tử lan theo mưa. Bệnh thường nặng khi vườn ẩm, cây mang nhiều quả hoặc bị suy dinh dưỡng.','Trên lá và cành xuất hiện vết nâu đen, có thể gây khô cành. Quả có vết thâm tròn, lõm dần, lan thành mảng đen làm quả khô và rụng.','Tỉa cành thông thoáng, thu gom quả và cành bệnh, bón phân cân đối và tránh làm tán ướt kéo dài. Phòng ở giai đoạn nguy cơ bằng thuốc có đăng ký, luân phiên nhóm cơ chế.']
  ,'Bệnh nấm hồng cà phê':['Nấm Corticium salmonicolor (tên hiện dùng Erythricium salmonicolor) phát triển mạnh trong mùa mưa, tán rậm và ẩm cao; lan từ cành bệnh sang mô khỏe.','Ban đầu có tơ nấm trắng mỏng, sau chuyển thành lớp mốc hồng trên vỏ cành. Vỏ nứt, phần cành phía trên héo, lá khô và cành có thể chết hoàn toàn.','Tỉa tán thông thoáng, cắt và tiêu hủy cành bệnh, khử trùng dụng cụ sau mỗi cây. Quét hoặc phun sản phẩm có đăng ký lên vùng bệnh và mô lân cận theo hướng dẫn chuyên môn.']
};
const genericDetails = {
  insect:['Côn trùng thường phát triển nhanh khi thức ăn non dồi dào và thời tiết thuận lợi; cần theo dõi đồng ruộng định kỳ để nhận biết sớm.','Chích hút hoặc ăn mô non làm giảm quang hợp, biến dạng bộ phận cây và tạo điều kiện cho tác nhân bệnh xâm nhập.','Vệ sinh đồng ruộng, canh tác cân đối, bảo vệ thiên địch và chỉ dùng thuốc có đăng ký khi mật số đạt ngưỡng. Luân phiên nhóm hoạt chất để hạn chế kháng.'],
  disease:['Tác nhân bệnh tồn tại trên cây, tàn dư hoặc trong đất và thường phát tán mạnh khi ẩm độ cao, mưa kéo dài.','Bệnh làm tổn thương lá, thân hoặc quả, giảm quang hợp và năng suất; triệu chứng có thể lan nhanh khi điều kiện thuận lợi.','Dùng giống sạch, vệ sinh vườn, tạo thông thoáng và quản lý nước tốt. Phát hiện sớm, dùng sản phẩm có đăng ký và luân phiên cơ chế tác động.']
};
const pestDetailModal = document.querySelector('#pestDetailModal');
function openPestDetail(crop, item) {
  const [name, symptom, atlas, pos] = item;
  const details = pestDetails[name] || genericDetails[atlas];
  const image = document.querySelector('#pestDetailImage');
  const exactPhoto = libraryPhotos[name];
  image.style.backgroundImage = exactPhoto ? `url("${exactPhoto}")` : 'none';
  image.style.backgroundSize = exactPhoto ? 'contain' : 'auto';
  image.style.backgroundPosition = 'center';
  image.classList.toggle('photo-pending', !exactPhoto);
  image.setAttribute('aria-label', name);
  document.querySelector('#pestDetailType').textContent = atlas === 'disease' ? 'Bệnh hại' : 'Sâu hại';
  document.querySelector('#pestDetailName').textContent = name;
  document.querySelector('#pestDetailCrop').textContent = `${cropNames[crop]} · Dấu hiệu: ${symptom}`;
  document.querySelector('#pestDetailGrowth').textContent = details[0];
  document.querySelector('#pestDetailDamage').textContent = details[1];
  document.querySelector('#pestDetailControl').textContent = details[2];
  pestDetailModal.showModal();
}
function renderCrop(crop) {
  const grid = document.querySelector('#pestLibraryGrid');
  grid.innerHTML = cropLibrary[crop].map(([name,symptom,atlas,pos], index) => { const photo = libraryPhotos[name]; return `<article class="pest-item" tabindex="0" role="button" data-pest-index="${index}" aria-label="Xem chi tiết ${name}"><div class="pest-sprite${photo ? '' : ' photo-pending'}" style="background-image:${photo ? `url('${photo}')` : 'none'};background-size:contain;background-position:center"></div><div><small>${atlas === 'disease' ? 'Bệnh hại' : 'Sâu hại'}</small><h4>${name}</h4><p>${symptom}</p></div></article>`; }).join('');
  grid.querySelectorAll('.pest-item').forEach(card => {
    const open = () => openPestDetail(crop, cropLibrary[crop][Number(card.dataset.pestIndex)]);
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  });
}
document.querySelectorAll('[data-crop]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-crop]').forEach(item => item.classList.remove('active')); button.classList.add('active'); renderCrop(button.dataset.crop); }));
renderCrop('rice');
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
document.querySelector('.pest-modal-close').addEventListener('click', () => pestDetailModal.close());
pestDetailModal.addEventListener('click', event => { if (event.target === pestDetailModal) pestDetailModal.close(); });

const newsGrid = document.querySelector('#newsGrid');
const newsUpdated = document.querySelector('#newsUpdated');
const escapeNews = value => String(value || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
fetch('news-data.json', { cache: 'no-store' }).then(response => response.ok ? response.json() : Promise.reject()).then(data => {
  const updated = new Date(data.updatedAt);
  newsUpdated.textContent = `lúc ${updated.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}, ${updated.toLocaleDateString('vi-VN')}`;
  newsGrid.innerHTML = data.items.map(item => `<article class="news-card reveal visible"><div class="news-meta"><span>${escapeNews(item.source)}</span><time datetime="${escapeNews(item.date)}">${new Date(item.date).toLocaleDateString('vi-VN')}</time></div><h3>${escapeNews(item.title)}</h3><p>${escapeNews(item.summary)}</p><a href="${escapeNews(item.url)}" target="_blank" rel="noopener noreferrer">Đọc bản tin gốc →</a></article>`).join('');
}).catch(() => {
  newsUpdated.textContent = 'chưa thể tải dữ liệu';
  newsGrid.innerHTML = '<article class="news-card"><h3>Không tải được bản tin</h3><p>Vui lòng thử tải lại trang hoặc liên hệ chuyên viên để nhận thông tin tại địa phương.</p></article>';
});

const marketGrid = document.querySelector('#marketGrid');
const marketUpdated = document.querySelector('#marketUpdated');
let marketGroups = [];
function renderMarket() {
  if (!marketGrid) return;
  marketGrid.innerHTML = marketGroups.length ? marketGroups.map(group => `<section class="market-price-group"><h3>${escapeNews(group.name)}</h3><ul>${(group.items || []).map(item => `<li><div class="market-price-line"><strong>${escapeNews(item.name)}:</strong> <span>${escapeNews(item.price)}</span></div>${item.detail ? `<small>${escapeNews(item.detail)}</small>` : ''}<a href="${escapeNews(item.url)}" target="_blank" rel="noopener noreferrer" title="${escapeNews(item.sourceTitle || '')}">${escapeNews(item.source)} · ${new Date(item.date).toLocaleDateString('vi-VN')} ↗</a></li>`).join('')}</ul></section>`).join('') : '<section class="market-price-group"><h3>Chưa có báo giá phù hợp</h3><p>Hệ thống sẽ hiển thị khi tìm thấy nguồn công khai có giá và ngày đăng rõ ràng.</p></section>';
}
if (marketGrid && marketUpdated) {
  fetch('market-data.json', { cache: 'no-store' }).then(response => response.ok ? response.json() : Promise.reject()).then(data => {
    marketGroups = Array.isArray(data.groups) ? data.groups : [];
    const updated = new Date(data.updatedAt);
    marketUpdated.textContent = `Lần quét: ${updated.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}, ${updated.toLocaleDateString('vi-VN')}`;
    renderMarket();
  }).catch(() => { marketUpdated.textContent = 'Chưa thể tải dữ liệu'; renderMarket(); });
}

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
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const issue = String(data.get('issue') || '').trim();
  const message = [
    'YÊU CẦU TƯ VẤN THUỐC BVTV',
    `Họ tên: ${name}`,
    `Số điện thoại: ${phone}`,
    `Cây trồng / tình trạng: ${issue || 'Chưa mô tả'}`,
    `Gửi từ website lúc: ${new Date().toLocaleString('vi-VN')}`
  ].join('\n');
  const zaloUrl = `https://zalo.me/0388051282?text=${encodeURIComponent(message)}`;
  window.open(zaloUrl, '_blank', 'noopener,noreferrer');
  toast.textContent = 'Đang mở Zalo với nội dung tư vấn đã điền.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
});
const backgroundMusic = document.querySelector('#backgroundMusic');
const musicToggle = document.querySelector('#musicToggle');

const mottoText = document.querySelector('#mottoText');
if (mottoText) {
  const mottos = [
    'Vững cây hôm nay — Bội thu ngày mai',
    'Hiểu cây trồng — Đúng giải pháp — Trọn niềm tin',
    'Đồng hành cùng nhà nông, kiến tạo mùa vụ bền vững',
    'Chăm từng mầm xanh — Gieo triệu mùa vàng'
  ];
  let mottoIndex = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    setInterval(() => {
      mottoText.classList.add('is-changing');
      setTimeout(() => {
        mottoIndex = (mottoIndex + 1) % mottos.length;
        mottoText.textContent = mottos[mottoIndex];
        mottoText.classList.remove('is-changing');
      }, 560);
    }, 6500);
  }
}

if (backgroundMusic && musicToggle) {
  backgroundMusic.volume = 0.22;
  musicToggle.addEventListener('click', async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        musicToggle.classList.add('is-playing');
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.setAttribute('aria-label', 'Tắt nhạc nền');
        musicToggle.querySelector('.music-label').textContent = 'Tắt nhạc';
      } catch (error) {
        musicToggle.querySelector('.music-label').textContent = 'Thử lại';
      }
    } else {
      backgroundMusic.pause();
      musicToggle.classList.remove('is-playing');
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Bật nhạc nền');
      musicToggle.querySelector('.music-label').textContent = 'Bật nhạc';
    }
  });
}

// Hạn chế thao tác sao chép/lưu ảnh thông thường trên máy tính và điện thoại.
// Đây là lớp bảo vệ giao diện; ảnh hiển thị trên web vẫn có thể bị chụp màn hình.
const protectedMediaSelector = [
  'img',
  '.featured-media',
  '.catalog-photo',
  '.product-image',
  '.modal-product-image',
  '.modal-pest-reference',
  '.pest-sprite',
  '.pest-detail-image',
  '.photo-frame',
  '.hero'
].join(',');

document.querySelectorAll('img').forEach(image => {
  image.draggable = false;
  image.setAttribute('draggable', 'false');
});

document.addEventListener('dragstart', event => {
  if (event.target.closest?.(protectedMediaSelector)) event.preventDefault();
});

document.addEventListener('contextmenu', event => {
  if (event.target.closest?.(protectedMediaSelector)) event.preventDefault();
});
