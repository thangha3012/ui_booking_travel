<template>
  <div class="dashboard-page">
    <div class="admin-page-header">
      <h1 class="page-title">{{ $t('admin.dashboard.title') }}</h1>
      <div class="flex gap-2">
        <Button
          :label="$t('admin.dashboard.refresh')"
          icon="pi pi-refresh"
          @click="fetchStats"
          outlined
          size="small"
        />
        <Button
          :label="$t('admin.dashboard.generateReport')"
          icon="pi pi-file-export"
          size="small"
        />
      </div>
    </div>

    <div class="stats-grid">
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="stat-card stat-card--loading">
          <Skeleton height="80px" borderRadius="12px" />
        </div>
      </template>
      <template v-else>
        <div class="stat-card">
          <div class="stat-info">
            <p class="label">{{ $t('admin.dashboard.revenue') }}</p>
            <h3 class="value">{{ stats.totalRevenue?.toLocaleString('vi-VN') || 0 }} đ</h3>
            <span class="trend is-positive"
              ><i class="pi pi-arrow-up text-xs"></i> 12%
              {{ $t('admin.dashboard.vsLastMonth') }}</span
            >
          </div>
          <div class="stat-icon bg-blue">
            <i class="pi pi-money-bill"></i>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <p class="label">{{ $t('admin.dashboard.tours') }}</p>
            <h3 class="value">{{ stats.totalTours || 0 }}</h3>
            <span class="trend is-positive">{{ $t('admin.dashboard.activeSystem') }}</span>
          </div>
          <div class="stat-icon bg-green">
            <i class="pi pi-map"></i>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <p class="label">{{ $t('admin.dashboard.users') }}</p>
            <h3 class="value">{{ stats.totalUsers || 0 }}</h3>
            <span class="trend is-positive">{{ $t('admin.dashboard.userAccounts') }}</span>
          </div>
          <div class="stat-icon bg-purple">
            <i class="pi pi-users"></i>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <p class="label">{{ $t('admin.dashboard.pending') }}</p>
            <h3 class="value">{{ stats.pendingBookings || 0 }}</h3>
            <span class="trend" :class="stats.pendingBookings > 0 ? 'is-negative' : 'is-positive'">
              {{
                stats.pendingBookings > 0
                  ? $t('admin.dashboard.actionRequired')
                  : $t('admin.dashboard.allCaughtUp')
              }}
            </span>
          </div>
          <div class="stat-icon bg-orange">
            <i class="pi pi-clock"></i>
          </div>
        </div>
      </template>
    </div>

    <!-- Main Content Area -->
    <div class="dashboard-content">
      <div class="admin-card recent-bookings">
        <div class="flex justify-between items-center mb-6">
          <h3 class="card-title">{{ $t('admin.dashboard.recentBookings') }}</h3>
          <RouterLink to="/admin/bookings">
            <Button
              :label="$t('admin.dashboard.viewAll')"
              icon="pi pi-external-link"
              text
              size="small"
            />
          </RouterLink>
        </div>

        <DataTable :value="recentBookings" :loading="loading" class="p-datatable-sm editorial-table" scrollable scrollHeight="flex">
          <Column field="id" :header="$t('admin.dashboard.columns.id')" style="width: 140px" class="font-mono text-xs" />
          <Column :header="$t('admin.dashboard.columns.customer')" style="min-width: 240px">
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <div class="user-initials">{{ data.customer.charAt(0) }}</div>
                <div>
                  <div class="font-semibold text-sm">{{ data.customer }}</div>
                  <div class="text-xs text-gray-400">{{ data.email }}</div>
                </div>
              </div>
            </template>
          </Column>
          <Column field="tour" :header="$t('admin.dashboard.columns.tour')" style="min-width: 280px" />
          <Column field="date" :header="$t('admin.dashboard.columns.date')" style="width: 150px" />
          <Column :header="$t('admin.dashboard.columns.status')" style="width: 160px">
            <template #body="{ data }">
              <Tag :value="$t('booking.status.' + data.status.toLowerCase())" :severity="getStatusSeverity(data.status)" rounded />
            </template>
          </Column>
          <Column :header="$t('admin.dashboard.columns.amount')" style="width: 120px" class="text-right">
            <template #body="{ data }">
              <span class="font-bold text-slate-800">{{ data.amount.toLocaleString('vi-VN') }} đ</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { dashboardApi } from '@/api/dashboardApi'
import { bookingApi } from '@/api/bookingApi'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'

const loading = ref(true)
const stats = ref({
  totalTours: 0,
  totalUsers: 0,
  pendingBookings: 0,
  totalRevenue: 0,
})

// We will fetch real recent bookings from bookingApi
const recentBookings = ref([])

// Tải các thông số thống kê tổng quát và danh sách đơn đặt tour gần đây cho Dashboard
async function fetchStats() {
  loading.value = true
  try {
    const res = await dashboardApi.getStats()
    if (res.success && res.data) {
      stats.value = res.data
    } else if (res && res.totalTours !== undefined) {
      // Direct assignment if res is the data itself
      stats.value = res
    }
  } catch (err) {
    console.error(err)
  }

  // Also fetch real recent bookings
  try {
    const bookingRes = await bookingApi.getAll()
    if (bookingRes && bookingRes.success && bookingRes.data) {
      // Map API data to the format table expects, take top 5
      recentBookings.value = bookingRes.data.slice(0, 5).map((b) => ({
        id: `#BK-${b.id}`,
        customer: b.contactName,
        email: b.contactEmail,
        tour: b.tourName,
        date: new Date(b.createdAt).toLocaleDateString(),
        status: getStatusString(b.status),
        amount: b.totalAmount,
      }))
    }
  } catch (err) {
    console.error('Error fetching bookings for dashboard', err)
  } finally {
    loading.value = false
  }
}

// Chuyển đổi mã trạng thái đơn hàng sang chuỗi văn bản (tiếng Anh)
function getStatusString(status) {
  switch (status) {
    case 1:
      return 'Pending'
    case 2:
      return 'Awaiting Payment'
    case 3:
      return 'Confirmed'
    case 4:
      return 'Cancelled'
    case 5:
      return 'Completed'
    default:
      return 'Unknown'
  }
}

// Xác định mức độ nghiêm trọng (màu sắc) của trạng thái để hiển thị Tag
function getStatusSeverity(status) {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'Pending':
      return 'warn'
    case 'Cancelled':
      return 'danger'
    default:
      return 'info'
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.dashboard-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fade-in-up 0.5s ease-out;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-6;
  margin-bottom: $space-8;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: white;
  border-radius: $border-radius-xl;
  padding: $space-6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: $shadow-sm;
  border: 1px solid $color-border-light;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-lg;
    border-color: $color-primary-light;
  }

  &--loading {
    padding: 0;
    border: none;
    box-shadow: none;
  }

  .stat-info {
    display: flex;
    flex-direction: column;
    .label {
      color: $color-text-secondary;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: $space-1;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .value {
      color: $color-text-primary;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: $space-1;
    }

    .trend {
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
      &.is-positive {
        color: $color-success;
      }
      &.is-negative {
        color: $color-danger;
      }
    }
  }

  .stat-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;

    &.bg-blue {
      background: #eff6ff;
      color: #2563eb;
    }
    &.bg-green {
      background: #f0fdf4;
      color: #16a34a;
    }
    &.bg-purple {
      background: #faf5ff;
      color: #9333ea;
    }
    &.bg-orange {
      background: #fff7ed;
      color: #ea580c;
    }
  }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: $space-6;
  flex: 1;
  overflow: hidden;
}

.recent-bookings {
  padding: $space-6;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.user-initials {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: $color-primary;
  font-size: 12px;
}

.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.gap-2 {
  gap: $space-2;
}
.gap-3 {
  gap: $space-3;
}
.mb-6 {
  margin-bottom: $space-6;
}
.mb-4 {
  margin-bottom: $space-4;
}
.mt-4 {
  margin-top: $space-4;
}
.text-xs {
  font-size: 12px;
}
.text-sm {
  font-size: 14px;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
.text-right {
  text-align: right;
}
.text-gray-400 {
  color: #94a3b8;
}
.font-mono {
  font-family: monospace;
}

:deep(.editorial-table) {
  .p-datatable-header {
    background: transparent;
    border: none;
  }
  .p-datatable-thead > tr > th {
    background: transparent;
    color: #64748b;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
  }
  .p-datatable-tbody > tr {
    transition: background 0.2s;
    &:hover {
      background: #f8fafc;
    }
    > td {
      border-bottom: 1px solid #f1f5f9;
      padding: 1rem;
    }
  }
}
</style>
