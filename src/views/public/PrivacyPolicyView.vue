<template>
  <div class="static-page">
    <div class="static-hero bg-slate-900 border-b border-slate-800">
      <div class="container mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Chính Sách Bảo Mật</h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">Chúng tôi trân trọng và bảo vệ quyền riêng tư của bạn.</p>
      </div>
    </div>
    
    <div class="container mx-auto px-6 py-16 max-w-4xl">
      <div class="prose prose-slate prose-lg max-w-none">
        <h2>1. Thu thập thông tin cá nhân</h2>
        <p>Chúng tôi thu thập các thông tin như Tên, Email, Số điện thoại khi bạn đăng ký tài khoản hoặc đặt tour nhằm mục đích liên lạc và tiến hành dịch vụ.</p>
        
        <h2>2. Sử dụng thông tin</h2>
        <p>Thông tin của bạn được sử dụng để xác nhận booking, gửi thông báo cập nhật, và trong các trường hợp hỗ trợ khẩn cấp. Triptopia tuyệt đối không mua bán hay trao đổi dữ liệu cá nhân của bạn cho bên thứ 3 vì mục đích thương mại.</p>

        <h2>3. Bảo mật thanh toán</h2>
        <p>Toàn bộ quá trình thanh toán qua VNPAY được mã hóa đầu cuối, đảm bảo không có chi tiết thẻ tín dụng/ngân hàng nào của bạn bị rò rỉ trên hệ thống của chúng tôi.</p>
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
</style>
