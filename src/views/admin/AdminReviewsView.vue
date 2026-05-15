<template>
  <div class="admin-reviews-page">
    <div class="admin-page-header">
      <div>
        <h1 class="page-title">Quản lý Đánh giá</h1>
        <p class="text-slate-500 text-sm mt-1">Quản lý và kiểm duyệt nhận xét từ khách hàng</p>
      </div>
      <Button icon="pi pi-refresh" rounded outlined @click="loadReviews" :loading="loading" />
    </div>

    <div class="admin-card">
      <DataTable :value="reviews" :loading="loading" paginator :rows="10" 
                 dataKey="id" :rowHover="true" class="p-datatable-sm"
                 v-model:filters="filters" filterDisplay="menu"
                 scrollable scrollHeight="flex"
                 :globalFilterFields="['user.fullName', 'title', 'tour.title']">
        <template #header>
            <div class="flex justify-end">
                <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -translate-y-2/4 left-3 text-slate-400"></i>
                    <InputText v-model="filters['global'].value" placeholder="Tìm kiếm..." class="pl-10" />
                </span>
            </div>
        </template>
        <template #empty>
            <div class="text-center py-8 text-slate-500">
                Không tìm thấy đánh giá nào.
            </div>
        </template>
        
        <Column field="id" header="ID" sortable style="width: 5%"></Column>
        <Column header="Người dùng" sortable field="user.fullName" style="width: 15%">
            <template #body="{ data }">
                <span class="font-bold">{{ data.user?.fullName || 'Khách' }}</span>
                <div class="text-[11px] text-slate-400">{{ data.user?.email }}</div>
            </template>
        </Column>
        <Column header="Tour" sortable field="tour.title" style="width: 20%">
            <template #body="{ data }">
                <span class="text-sm font-medium text-slate-700 line-clamp-2">{{ data.tour?.title }}</span>
            </template>
        </Column>
        <Column header="Đánh giá" sortable field="rating" style="width: 25%">
            <template #body="{ data }">
                <div class="text-yellow-500 text-xs mb-1">
                    <i v-for="i in 5" :key="i" class="pi" :class="i <= data.rating ? 'pi-star-fill' : 'pi-star'"></i>
                </div>
                <div class="font-bold text-sm text-slate-800">{{ data.title }}</div>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2" :title="data.content">{{ data.content }}</div>
            </template>
        </Column>
        <Column field="createdAt" header="Ngày gửi" sortable style="width: 15%">
            <template #body="{ data }">
                {{ new Date(data.createdAt).toLocaleDateString('vi-VN') }}
            </template>
        </Column>
        <Column field="status" header="Trạng thái" sortable style="width: 10%">
            <template #body="{ data }">
                <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
            </template>
        </Column>
        <Column header="Thao tác" style="width: 10%" alignFrozen="right">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button v-if="data.status === 1" icon="pi pi-check" severity="success" rounded text @click="updateStatus(data.id, 2)" title="Phê duyệt" />
                    <Button v-if="data.status === 1" icon="pi pi-times" severity="warning" rounded text @click="updateStatus(data.id, 3)" title="Từ chối" />
                    <Button icon="pi pi-trash" severity="danger" rounded text @click="deleteReview(data.id)" title="Xóa" />
                </div>
            </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import reviewApi from '@/api/reviewApi'

// PrimeVue components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

const reviews = ref([])
const loading = ref(false)

const filters = ref({
    global: { value: null, matchMode: 'contains' }
})

const getStatusLabel = (status) => {
    switch (status) {
        case 1: return 'Chờ duyệt'
        case 2: return 'Đã duyệt'
        case 3: return 'Bị từ chối'
        default: return 'Không xác định'
    }
}

const getStatusSeverity = (status) => {
    switch (status) {
        case 1: return 'warn'
        case 2: return 'success'
        case 3: return 'danger'
        default: return 'info'
    }
}

const loadReviews = async () => {
    loading.value = true
    try {
        const res = await reviewApi.getAllForAdmin()
        if (res && res.success) {
            reviews.value = res.data
        }
    } catch (e) {
        console.error('Lỗi khi tải đánh giá', e)
        alert('Tải dữ liệu thất bại')
    } finally {
        loading.value = false
    }
}

const updateStatus = async (id, status) => {
    if (!confirm(status === 1 ? 'Bạn chắc chắn duyệt nhận xét này?' : 'Bạn muốn từ chối nhận xét này?')) return;
    try {
        const res = await reviewApi.updateStatus(id, status);
        if (res && res.success) {
            loadReviews(); // Tải lại dữ liệu
        }
    } catch (e) {
        alert('Cập nhật trạng thái thất bại');
    }
}

const deleteReview = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhận xét này không? Thao tác không thể hoàn tác.')) return;
    try {
        const res = await reviewApi.deleteReview(id);
        if (res && res.success) {
            loadReviews(); // Tải lại dữ liệu
        }
    } catch (e) {
        alert('Xóa nhận xét thất bại');
    }
}

onMounted(() => {
    loadReviews()
})
</script>
<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.admin-reviews-page { 
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fade-in-up 0.4s ease-out; 
}
@keyframes fade-in-up { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
