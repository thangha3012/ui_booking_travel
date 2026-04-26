<template>
  <div class="static-page">
    <div class="static-hero bg-slate-900 border-b border-slate-800">
      <div class="container mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Về Triptopia</h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">Chúng tôi mang đến những hành trình tuyệt vời, giúp bạn khám phá thế giới với những trải nghiệm không thể nào quên.</p>
      </div>
    </div>
    
    <div class="container mx-auto px-6 py-16 max-w-4xl">
      <div class="prose prose-slate prose-lg max-w-none">
        <h2>Sứ mệnh của chúng tôi</h2>
        <p>Triptopia ra đời với sứ mệnh mang đến công nghệ đặt tour tiên tiến nhất, kết nối những tín đồ xê dịch với các nhà cung cấp dịch vụ chất lượng cao trên toàn thế giới. Chúng tôi tin rằng mỗi chuyến đi không chỉ là những danh thắng, mà còn là kỷ niệm đáng giá theo bạn suốt cuộc đời.</p>

        <h2 class="mt-12">Tầm nhìn</h2>
        <p>Trở thành nền tảng số 1 Đông Nam Á về phân phối sản phẩm du lịch trực tuyến. Cập nhật và nắm bắt xu thế công nghệ để đem lại sự an tâm, nhanh chóng và mượt mà nhất trong trải nghiệm đặt vé.</p>

        <h2 class="mt-12">Đội ngũ</h2>
        <p>Đội ngũ sáng lập Triptopia là những người đam mê du lịch và am hiểu công nghệ. Kinh nghiệm nhiều năm từ các chuyên gia giúp chúng tôi chọn lọc được đối tác tốt nhất, đem tới cho bạn mức giá vô cùng hợp lý.</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.static-page {
  background: white;
  min-height: 100vh;
}
.prose h2 {
  color: $color-primary;
  font-weight: 800;
  margin-bottom: 1rem;
}
</style>
