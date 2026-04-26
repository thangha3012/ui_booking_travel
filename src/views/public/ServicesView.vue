<template>
  <div class="static-page">
    <div class="static-hero bg-slate-900 border-b border-slate-800">
      <div class="container mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Dịch Vụ Của Chúng Tôi</h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">Trọn bộ giải pháp du lịch thông minh, tiện lợi, đảm bảo đem đến cho bạn kỳ nghỉ hoàn hảo.</p>
      </div>
    </div>
    
    <div class="container mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="service-card">
          <div class="icon pb-4 text-4xl text-blue-600"><i class="pi pi-compass"></i></div>
          <h3 class="text-xl font-bold mb-2">Tour Trọn Gói</h3>
          <p class="text-slate-600">Chúng tôi cung cấp các tour du lịch trọn gói trong và ngoài nước, lịch trình linh hoạt và đội ngũ hướng dẫn viên chuyên nghiệp.</p>
        </div>
        <div class="service-card">
          <div class="icon pb-4 text-4xl text-green-600"><i class="pi pi-building"></i></div>
          <h3 class="text-xl font-bold mb-2">Đặt Phòng Khách Sạn</h3>
          <p class="text-slate-600">Hệ thống liên kết hàng ngàn khách sạn, resort từ 3 sao đến 5 sao sang trọng với mức giá cực tốt.</p>
        </div>
        <div class="service-card">
          <div class="icon pb-4 text-4xl text-orange-600"><i class="pi pi-car"></i></div>
          <h3 class="text-xl font-bold mb-2">Cho Thuê Xe</h3>
          <p class="text-slate-600">Dịch vụ cho thuê xe đa dạng các chủng loại, tài xế bản địa cực kỳ am hiểu tuyến đường.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.static-page { background: white; min-height: 100vh; }
.service-card {
  padding: 2rem;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
}
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
}
</style>
