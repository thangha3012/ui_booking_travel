const API_BASE_URL = 'https://localhost:7001/api';
// Sử dụng thông tin admin mới do User cung cấp
const ADMIN_CREDENTIALS = { email: 'admin04@bacviet.com', password: 'Admin@123' };

// Bỏ ignore self-signed certificate cho localhost
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Hàm helper fetch với JSON (tích hợp sẵn trong Node.js >= v18)
const fetchWithJson = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || res.statusText);
  return data;
}

const seedData = async () => {
  try {
    console.log('🔄 Bắt đầu Seed Data...');
    
    const loginRes = await fetchWithJson(`${API_BASE_URL}/Auth/login`, {
      method: 'POST', body: JSON.stringify(ADMIN_CREDENTIALS)
    });
    const token = loginRes.data.token;
    console.log('✅ Token:', token.substring(0, 10) + '...');
    const headers = { Authorization: `Bearer ${token}` };

    const destinations = [
      { name: 'Hà Giang', province: 'Hà Giang', country: 'Việt Nam', description: 'Vùng cao nguyên đá hùng vĩ.', coverImageUrl: 'https://images.unsplash.com/photo-1559592413-7cea4ee5e305?w=800&q=80' },
      { name: 'Sa Pa', province: 'Lào Cai', country: 'Việt Nam', description: 'Thị trấn mờ sương, ruộng bậc thang tuyệt đẹp.', coverImageUrl: 'https://images.unsplash.com/photo-1601053077741-6107530661ff?w=800&q=80' },
      { name: 'Hạ Long', province: 'Quảng Ninh', country: 'Việt Nam', description: 'Kỳ quan thiên nhiên thế giới.', coverImageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80' },
      { name: 'Ninh Bình', province: 'Ninh Bình', country: 'Việt Nam', description: 'Vịnh Hạ Long trên cạn.', coverImageUrl: 'https://images.unsplash.com/photo-1550951298-5c7b95a66bfc?w=800&q=80' }
    ];
    let destIds = [];
    for (const d of destinations) {
      let r = await fetchWithJson(`${API_BASE_URL}/Destination`, { method: 'POST', headers, body: JSON.stringify(d) });
      destIds.push(r.data.id);
    }
    
    const categories = [
      { name: 'Trekking & Mạo hiểm', description: 'Các tour leo núi, khám phá thiên nhiên hoang dã', displayOrder: 1 },
      { name: 'Nghỉ dưỡng & Resort', description: 'Du lịch nghỉ dưỡng cao cấp', displayOrder: 2 },
      { name: 'Văn hóa & Di sản', description: 'Khám phá văn hóa bản địa lâu đời', displayOrder: 3 },
      { name: 'Du thuyền', description: 'Khám phá biển đảo trên du thuyền', displayOrder: 4 }
    ];
    let catIds = [];
    for (const c of categories) {
      let r = await fetchWithJson(`${API_BASE_URL}/Category`, { method: 'POST', headers, body: JSON.stringify(c) });
      catIds.push(r.data.id);
    }

    const rawTours = [
      { title: 'Chinh phục đỉnh Fansipan 2N1Đ', desc: 'Hành trình leo núi vĩ đại nhất Đông Dương.', categoryIndex: 0, destIndex: 1 },
      { title: 'Khám phá Hà Giang 3N2Đ', desc: 'Chạy xe máy chinh phục đèo Mã Pì Lèng huyền thoại.', categoryIndex: 0, destIndex: 0 },
      { title: 'Tràng An - Bái Đính 1 Ngày', desc: 'Tham quan quần thể di sản thiên nhiên thế giới Tràng An.', categoryIndex: 2, destIndex: 3 },
      { title: 'Du thuyền Hạ Long 5 sao', desc: 'Ngủ đêm trên vịnh Hạ Long với du thuyền quốc tế cao cấp.', categoryIndex: 3, destIndex: 2 }
    ];

    for (const rt of rawTours) {
      const tourPayload = {
        categoryId: catIds[rt.categoryIndex],
        destinationId: destIds[rt.destIndex],
        title: rt.title,
        description: rt.desc,
        highlights: 'Bảo hiểm đầy đủ. Hướng dẫn viên địa phương nhiệt tình.',
        itinerary: 'Ngày 1: Đón khách. Ngày 2: Trải nghiệm. Ngày 3: Về.',
        policies: 'Hoàn tiền 100% nếu hủy trước 7 ngày.'
      };
      
      let tRes = await fetchWithJson(`${API_BASE_URL}/Tour`, { method: 'POST', headers, body: JSON.stringify(tourPayload) });
      let id = tRes.data.id;
      
      // Update sang status: 2 (Published)
      await fetchWithJson(`${API_BASE_URL}/Tour/${id}`, { method: 'PUT', headers, body: JSON.stringify({...tourPayload, status: 2 }) });
      
      // Gắn bảng giá và lịch trình để Tour xuất hiện (do hàm GetAll filter giá min/max cần Pricing)
      const d1 = new Date(); d1.setDate(d1.getDate() + 10);
      const d2 = new Date(); d2.setDate(d2.getDate() + 13);
      const basePrice = Math.floor(Math.random() * 50) + 50; 
      await fetchWithJson(`${API_BASE_URL}/Tour/${id}/schedules`, {
         method: 'POST', headers,
         body: JSON.stringify({
           departureDate: d1.toISOString(), returnDate: d2.toISOString(), totalSeats: 20,
           pricings: [ { passengerType: 1, price: basePrice }, { passengerType: 2, price: basePrice * 0.7 }, { passengerType: 3, price: 0 } ]
         })
      });
      console.log(`✅ Created Tour ${id} (${rt.title})`);
    }
    console.log('🎉 SEED DATA SUCCESS!');
  } catch (e) {
    console.error('❌ SEED DATA ERROR:', e.message);
  }
}

seedData();
