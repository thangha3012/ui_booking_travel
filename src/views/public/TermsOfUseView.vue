<template>
  <div class="static-page">
    <div class="static-hero bg-slate-900 border-b border-slate-800">
      <div class="container mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Điều Khoản Sử Dụng</h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">Xin vui lòng đọc kỹ trước khi sử dụng dịch vụ của Triptopia.</p>
      </div>
    </div>
    
    <div class="container mx-auto px-6 py-16 max-w-4xl">
      <div class="prose prose-slate prose-lg max-w-none">
        <h2>1. Chấp thuận điều khoản</h2>
        <p>Bằng cách sử dụng nền tảng Triptopia, bạn đồng ý tuân thủ toàn bộ các chính sách, quy định của chúng tôi. Nếu bạn không đồng ý với một phần nào đó, vui lòng ngừng sử dụng website.</p>
        
        <h2>2. Trách nhiệm người dùng</h2>
        <p>Người dùng phải cung cấp thông tin chính xác khi đặt tour và có trách nhiệm tự bảo vệ bảo mật tài khoản cá nhân. Nghiêm cấm các hành động lấy cắp hay phá hoại hạ tầng mạng của Triptopia.</p>

        <h2>3. Chính sách hoàn hủy</h2>
        <ul>
          <li>Hủy trước 7 ngày khởi hành: Hoàn tiền 100% chi phí.</li>
          <li>Hủy trong vòng 3-6 ngày: Hoàn tiền 50%.</li>
          <li>Hủy ít hơn 3 ngày: Không hoàn tiền.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.static-page { background: white; min-height: 100vh; }
.prose h2 {
  color: $color-primary;
  font-weight: 800;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
ul { list-style-type: disc; padding-left: 2rem; }
li { margin-bottom: 0.5rem; }
</style>
