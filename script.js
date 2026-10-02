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
  'Cetamiusavb 35WG': { active:'Acetamiprid 15% + Flonicamid 20% · IRAC 4A + 29', mechanism:'Tác động thần kinh + ngừng chích hút', analysis:'Acetamiprid tác động lên thụ thể nicotinic; Flonicamid làm côn trùng ngừng chích hút. Phối hợp phù hợp nhóm chích hút, đặc biệt bọ trĩ và rệp.', targets:['01 · Bọ trĩ trên hoa cúc','02 · Rệp mềm','03 · Bọ phấn'], note:'Đối tượng đăng ký trên nhãn: bọ trĩ trên hoa cúc.', atlas:'insect', pos:'50% 100%', pest:'Bọ trĩ và triệu chứng chích hút' },
  'SV-Stellar 30SC': { active:'Clothianidin 30% w/w · IRAC 4A', mechanism:'Chủ vận thụ thể nicotinic acetylcholine', analysis:'Hoạt chất lưu dẫn, tác động tiếp xúc và vị độc lên hệ thần kinh côn trùng. Thích hợp hơn với nhóm chích hút so với sâu lớn miệng nhai.', targets:['01 · Rệp mềm','02 · Rầy nâu','03 · Bọ phấn'], note:'Cây trồng và đối tượng cụ thể phải đối chiếu đúng nhãn.', atlas:'insect', pos:'50% 0%', pest:'Nhóm côn trùng chích hút' },
  'Unizeb M-45 80WP': { active:'Mancozeb 80% w/w · FRAC M03', mechanism:'Tiếp xúc đa điểm – phòng bệnh', analysis:'Ức chế nhiều enzyme chứa nhóm sulfhydryl của nấm bệnh. Tác động đa điểm giúp quản lý nguy cơ kháng nhưng cần phủ đều bề mặt trước hoặc sớm khi bệnh xuất hiện.', targets:['01 · Thán thư trên thanh long','02 · Sương mai, mốc sương','03 · Đốm lá do nấm'], note:'Đối tượng đăng ký trên nhãn: thán thư trên thanh long.', atlas:'disease', pos:'50% 0%', pest:'Tổn thương thán thư, đốm lá do nấm' },
  'IMITADO 350SC': { active:'Imidacloprid 350 g/L · IRAC 4A', mechanism:'Tác động hệ thần kinh – lưu dẫn', analysis:'Gắn lên thụ thể nicotinic acetylcholine, gây rối loạn dẫn truyền thần kinh. Hữu hiệu chủ yếu với côn trùng chích hút trên đọt và mặt dưới lá.', targets:['01 · Rệp mềm','02 · Bọ phấn','03 · Bọ trĩ'], note:'Chỉ dùng cho cây trồng, đối tượng và liều lượng ghi trên nhãn.', atlas:'insect', pos:'100% 100%', pest:'Côn trùng chích hút trên đọt non' },
  'TukTuk 20SC': { active:'Lambda-cyhalothrin + Thiamethoxam · IRAC 3A + 4A', mechanism:'Hạ gục tiếp xúc + lưu dẫn thần kinh', analysis:'Pyrethroid tạo hiệu ứng hạ gục nhanh; Thiamethoxam bổ sung tính lưu dẫn với nhóm chích hút. Cần quản lý thiên địch và tránh lặp lại cùng nhóm cơ chế.', targets:['01 · Rầy nâu','02 · Rệp mềm','03 · Bọ phấn'], note:'Chưa có đầy đủ mặt sau nhãn; không hiển thị liều dùng.', atlas:'insect', pos:'100% 100%', pest:'Nhóm chích hút trên đọt và lá non' },
  'Nofada 822WP': { active:'Tricyclazole 440 + Isoprothiolane 350 + Hexaconazole 32 g/kg', mechanism:'Ức chế melanin + phospholipid + sterol', analysis:'Ba cơ chế bổ trợ cho bệnh đạo ôn: hạn chế hình thành đĩa áp, cản trở xâm nhiễm và ức chế phát triển sợi nấm. Ưu tiên bảo vệ lá và cổ bông theo đúng nhãn.', targets:['01 · Đạo ôn lá trên lúa','02 · Đạo ôn cổ bông','03 · Nhóm bệnh nấm trên lúa theo nhãn'], note:'Đối tượng đăng ký trên nhãn: đạo ôn trên lúa; thời gian cách ly 14 ngày.', atlas:'disease', pos:'0% 0%', pest:'Vết bệnh đạo ôn hình thoi trên lá lúa' },
  'Masterone 26SC': { active:'Fenoxanil 20% + Kresoxim-methyl 6% · FRAC 16.1 + 11', mechanism:'Ức chế hình thành melanin + hô hấp ty thể', analysis:'Fenoxanil cản trở xâm nhiễm; Kresoxim-methyl chặn truyền electron tại phức hợp III. Phối hợp cho tác động phòng và trị sớm, cần luân phiên nhóm FRAC.', targets:['01 · Thán thư trên cà phê','02 · Đốm lá do nấm','03 · Bệnh nấm giai đoạn xâm nhiễm sớm'], note:'Đối tượng đăng ký trên nhãn: thán thư trên cà phê; cách ly 10 ngày.', atlas:'disease', pos:'100% 100%', pest:'Thán thư trên lá và quả cà phê' },
  'Rhett 60WG': { active:'Metiram 55% + Pyraclostrobin 5% · FRAC M03 + 11', mechanism:'Tiếp xúc đa điểm + ức chế hô hấp ty thể', analysis:'Metiram tạo lớp bảo vệ tiếp xúc đa điểm, tác động lên nhiều enzyme của nấm bệnh. Pyraclostrobin có tính nội hấp và lưu dẫn, ức chế truyền electron tại phức hợp III. Phối hợp phù hợp cho phòng bệnh và can thiệp sớm; cần luân phiên cơ chế để quản lý kháng.', targets:['01 · Rỉ sắt trên hoa cúc','02 · Nhóm bệnh nấm ở giai đoạn mới xuất hiện','03 · Bảo vệ lá theo phạm vi ghi trên nhãn'], note:'Đối tượng đăng ký trên nhãn: rỉ sắt trên hoa cúc. Liều 1,3 kg/ha; lượng nước 500 lít/ha; cách ly 7 ngày.', atlas:'disease', pos:'50% 100%', pest:'Rỉ sắt – các ổ bào tử màu vàng cam trên lá' },
  'Matsu Power 12SC': { active:'Chlorfenapyr 9,5% + Lufenuron 2,5% · IRAC 13 + 15', mechanism:'Phá vỡ tạo năng lượng + ức chế tổng hợp chitin', analysis:'Chlorfenapyr được hoạt hóa trong cơ thể côn trùng, làm gián đoạn quá trình tạo ATP; Lufenuron ức chế tạo chitin khiến sâu non không thể lột xác bình thường. Hai cơ chế bổ trợ cho tác động tiếp xúc, vị độc và khả năng kiểm soát kéo dài trên sâu non.', targets:['01 · Sâu keo mùa thu trên ngô','02 · Sâu ăn lá tuổi nhỏ','03 · Sâu non bộ cánh vảy'], note:'Đối tượng đăng ký trên nhãn: sâu keo mùa thu trên ngô. Liều 0,4 lít/ha; lượng nước 500 lít/ha hoặc pha 30 ml cho 18–20 lít nước; phun khi sâu tuổi 1–2; cách ly 14 ngày.', atlas:'insect', pos:'0% 0%', pest:'Sâu keo mùa thu – sâu non gây hại trong nõn ngô' },
  'Techtimex 50WG': { active:'Emamectin benzoate 49 g/kg + Matrine 1 g/kg · IRAC 6 + hoạt chất sinh học', mechanism:'Kích hoạt kênh chloride + tác động thần kinh đa điểm', analysis:'Emamectin benzoate làm tăng dòng ion chloride qua màng tế bào thần kinh, khiến sâu nhanh ngừng ăn, tê liệt và chết. Matrine có nguồn gốc thảo mộc, bổ sung tác động tiếp xúc và vị độc. Phối hợp phù hợp để kiểm soát sâu non ăn lá và hỗ trợ quản lý tính kháng.', targets:['01 · Sâu cuốn lá trên lúa','02 · Sâu ăn lá tuổi nhỏ','03 · Sâu non bộ cánh vảy'], note:'Đối tượng đăng ký trên nhãn: sâu cuốn lá trên lúa. Liều 100–150 g/ha; lượng nước 400–600 lít/ha; phun khi sâu tuổi 1–2; cách ly 7 ngày.', atlas:'insect', pos:'0% 0%', pest:'Sâu cuốn lá nhỏ – sâu non cuốn lá và cạo biểu bì lúa' }
};

const pestPhotos = {
  'Sâu keo mùa thu trên ngô':'assets/pests/fall-armyworm-larva.jpg',
  'Sâu cuốn lá lúa':'assets/pests/rice-leaf-folder-larva.jpg',
  'Sâu cuốn lá trên lúa':'assets/pests/rice-leaf-folder-larva.jpg',
  'Sâu đục thân, sâu ăn lá':'assets/pests/rice-stem-borer.webp',
  'Sâu ăn lá, sâu xanh':'assets/pests/geometer-caterpillar.webp',
  'Sâu ăn lá tuổi nhỏ':'assets/pests/fall-armyworm-larva.jpg',
  'Sâu non bộ cánh vảy':'assets/pests/fall-armyworm-larva.jpg',
  'Bọ trĩ trên hoa cúc':'assets/pests/thrips.jpg',
  'Bọ trĩ':'assets/pests/thrips.jpg',
  'Rệp mềm':'assets/pests/aphid.jpg',
  'Rầy nâu':'assets/pests/brown-planthopper.jpg',
  'Bọ phấn, côn trùng chích hút':'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Bemisia_tabaci_under_leaf_of_eggplant.jpg/500px-Bemisia_tabaci_under_leaf_of_eggplant.jpg?utm_source=commons.wikimedia.org',
  'Bọ phấn':'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Bemisia_tabaci_under_leaf_of_eggplant.jpg/500px-Bemisia_tabaci_under_leaf_of_eggplant.jpg?utm_source=commons.wikimedia.org',
  'Thán thư trên thanh long':'assets/pests/dragon-fruit-anthracnose.webp',
  'Sương mai, mốc sương':'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Downy_mildew_on_leaves_of_Cucumis_sativus.jpg/500px-Downy_mildew_on_leaves_of_Cucumis_sativus.jpg?utm_source=commons.wikimedia.org',
  'Đốm lá do nấm':'assets/pests/tea-anthracnose.webp',
  'Rỉ sắt trên hoa cúc':'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Chrysanthemum_white_rust.jpg/960px-Chrysanthemum_white_rust.jpg',
  'Đạo ôn lá trên lúa':'assets/pests/rice-blast.jpg',
  'Đạo ôn cổ bông':'assets/pests/rice-neck-blast.webp',
  'Nhóm bệnh nấm trên lúa theo nhãn':'assets/pests/rice-blast.jpg',
  'Thán thư trên cà phê':'assets/pests/coffee-anthracnose.webp',
  'Bệnh nấm giai đoạn xâm nhiễm sớm':'assets/pests/coffee-anthracnose.webp',
  'Nhóm bệnh nấm ở giai đoạn mới xuất hiện':'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Chrysanthemum_white_rust.jpg/960px-Chrysanthemum_white_rust.jpg',
  'Bảo vệ lá theo phạm vi ghi trên nhãn':'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Chrysanthemum_white_rust.jpg/960px-Chrysanthemum_white_rust.jpg'
};

const representativeTargets = new Set([
  'Sâu đục thân, sâu ăn lá', 'Sâu ăn lá, sâu xanh', 'Sâu ăn lá tuổi nhỏ', 'Sâu non bộ cánh vảy',
  'Sương mai, mốc sương', 'Đốm lá do nấm', 'Nhóm bệnh nấm trên lúa theo nhãn',
  'Bệnh nấm giai đoạn xâm nhiễm sớm', 'Nhóm bệnh nấm ở giai đoạn mới xuất hiện',
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
        ? `${label} · ${representativeTargets.has(label) ? 'ảnh đại diện cho nhóm đối tượng' : 'ảnh nhận diện đúng đối tượng'}`
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
  durian:[['Rệp sáp','Cụm sáp trắng trên trái và cuống','insect','50% 100%'],['Bọ trĩ','Gây sẹo vỏ trái non','insect','0% 100%'],['Phytophthora','Thối trái, xì mủ thân cành','disease','0% 100%']],
  citrus:[['Rầy chổng cánh','Chích hút đọt, môi giới greening','insect','100% 100%'],['Rệp sáp','Bám chùm quả, cuống và cành','insect','50% 100%'],['Loét vi khuẩn','Vết sần có quầng vàng','disease','50% 100%']],
  coffee:[['Rệp sáp','Bám chùm quả, rễ và cành','insect','50% 100%'],['Bọ trĩ','Hại hoa và chồi non','insect','0% 100%'],['Thán thư','Khô cành, đốm lá và quả','disease','100% 100%']]
};
const cropNames = {rice:'Lúa',tea:'Chè',lychee:'Vải',cucumber:'Dưa chuột',durian:'Sầu riêng',citrus:'Cam, quýt',coffee:'Cà phê'};
const libraryPhotos = {
  'Sâu cuốn lá nhỏ':'assets/pests/rice-leaf-folder-larva.jpg',
  'Rầy nâu':'assets/pests/brown-planthopper.jpg',
  'Sâu đục thân lúa':'assets/pests/rice-stem-borer.webp',
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
  'Rầy chổng cánh':'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Asian_citrus_psyllid_%28Diaphorina_citri%29_on_Citrus_%C3%97_aurantiifolia.jpg/500px-Asian_citrus_psyllid_%28Diaphorina_citri%29_on_Citrus_%C3%97_aurantiifolia.jpg?utm_source=commons.wikimedia.org',
  'Loét vi khuẩn':'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Citrus_canker_on_foliage.jpg/500px-Citrus_canker_on_foliage.jpg?utm_source=commons.wikimedia.org',
  'Thán thư':'assets/pests/coffee-anthracnose.webp'
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
  'Rầy chổng cánh':['Trưởng thành đẻ trứng trên đọt non; ấu trùng sống tập trung trên chồi. Mật số tăng theo các đợt ra lộc và chúng là môi giới truyền bệnh greening.','Chích hút làm đọt cong, lá biến dạng; nguy hiểm nhất là truyền vi khuẩn gây vàng lá gân xanh.','Dùng cây giống sạch bệnh, quản lý cây ký chủ, tỉa bỏ cây bệnh và theo dõi đồng loạt các đợt lộc. Bảo vệ thiên địch, xử lý rầy trên đọt non theo đúng nhãn.'],
  'Loét vi khuẩn':['Vi khuẩn xâm nhập qua khí khổng và vết thương, phát tán bởi mưa gió, dụng cụ và cây giống; nặng hơn trong mùa mưa bão.','Vết sần nâu có quầng vàng trên lá, cành và quả; gây rụng lá, giảm phẩm chất và là nguồn lây lan.','Dùng giống sạch, chắn gió, tỉa tiêu hủy cành bệnh, khử trùng dụng cụ và hạn chế gây xây xát. Áp dụng sản phẩm có đăng ký theo hướng dẫn địa phương.'],
  'Thán thư':['Nấm tồn tại trên cành, lá, quả bệnh; bào tử phát tán theo mưa và phát triển mạnh khi ẩm cao, cây mang nhiều quả hoặc suy yếu.','Gây đốm lá, khô cành và vết lõm sẫm trên quả; có thể làm rụng quả non và khô chùm quả.','Tỉa cành thông thoáng, thu gom nguồn bệnh, dinh dưỡng cân đối và tránh tưới ướt tán. Phòng ở thời kỳ nguy cơ và luân phiên thuốc đăng ký khác nhóm FRAC.']
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
const marketLabels = { fertilizer: 'Phân bón', pesticide: 'Thuốc BVTV', seed: 'Giống' };
const marketTrendLabels = { up: '↗ Xu hướng tăng', down: '↘ Xu hướng giảm', stable: '→ Ít biến động' };
let marketItems = [];
function renderMarket(filter = 'all') {
  if (!marketGrid) return;
  const items = filter === 'all' ? marketItems : marketItems.filter(item => item.category === filter);
  marketGrid.innerHTML = items.length ? items.map(item => `<article class="market-card"><div class="market-card-head"><span class="market-category">${escapeNews(marketLabels[item.category] || 'Vật tư')}</span><span class="market-trend ${escapeNews(item.trend)}">${escapeNews(marketTrendLabels[item.trend] || marketTrendLabels.stable)}</span></div><h3>${escapeNews(item.title)}</h3>${item.price ? `<div class="market-price-highlight">${escapeNews(item.price)}</div>` : ''}<p>${escapeNews(item.summary)}</p><footer><span>${escapeNews(item.source)} · ${new Date(item.date).toLocaleDateString('vi-VN')}</span><a href="${escapeNews(item.url)}" target="_blank" rel="noopener noreferrer">Xem nguồn →</a></footer></article>`).join('') : '<article class="market-card"><h3>Chưa có báo giá phù hợp</h3><p>Hệ thống sẽ hiển thị khi tìm thấy nguồn công khai có ngày và nội dung rõ ràng.</p></article>';
}
if (marketGrid && marketUpdated) {
  fetch('market-data.json', { cache: 'no-store' }).then(response => response.ok ? response.json() : Promise.reject()).then(data => {
    marketItems = Array.isArray(data.items) ? data.items : [];
    const updated = new Date(data.updatedAt);
    marketUpdated.textContent = `Lần quét: ${updated.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}, ${updated.toLocaleDateString('vi-VN')}`;
    renderMarket();
  }).catch(() => { marketUpdated.textContent = 'Chưa thể tải dữ liệu'; renderMarket(); });
  document.querySelectorAll('[data-market-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-market-filter]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderMarket(button.dataset.marketFilter);
  }));
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
