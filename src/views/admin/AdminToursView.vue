<template>
  <div class="admin-tours-page">
    <div class="admin-page-header">
      <h1 class="page-title">{{ $t('admin.tours.title') }}</h1>
      <Button
        :label="$t('admin.tours.addTour')"
        icon="pi pi-plus"
        @click="openCreateModal"
        raised
      />
    </div>

    <div class="admin-card">
      <DataTable
        :value="filteredTours"
        :loading="loading"
        stripedRows
        removableSort
        :rows="10"
        :paginator="filteredTours.length > 10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 25, 50]"
        tableStyle="min-width: 60rem"
        class="p-datatable-sm"
        scrollable
        scrollHeight="flex"
      >
        <template #header>
          <div class="table-header">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchQuery" :placeholder="$t('admin.tours.searchPlaceholder')" />
            </IconField>
            <Select
              v-model="statusFilter"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('admin.tours.allStatus')"
              showClear
              style="width: 160px"
            />
          </div>
        </template>

        <template #empty>
          <div class="empty-msg">
            <i class="pi pi-compass" style="font-size: 2rem; opacity: 0.3"></i>
            <p>{{ $t('admin.tours.noTours') }}</p>
          </div>
        </template>

        <Column field="id" :header="$t('admin.tours.columns.id')" sortable style="width: 80px">
          <template #body="{ data }"
            ><span class="id-badge">#{{ data.id }}</span></template
          >
        </Column>
        <Column :header="$t('admin.tours.columns.cover')" style="width: 80px">
          <template #body="{ data }">
            <img
              :src="getTourCover(data)"
              alt="tour"
              class="t-thumbnail"
            />
          </template>
        </Column>
        <Column field="title" :header="$t('admin.tours.columns.name')" sortable>
          <template #body="{ data }">
            <div>
              <strong>{{ data.title }}</strong>
            </div>
            <small style="color: var(--p-text-muted-color)">{{ data.categoryName }}</small>
          </template>
        </Column>
        <Column field="destinationName" :header="$t('admin.tours.columns.location')" sortable />
        <Column
          field="status"
          :header="$t('admin.tours.columns.status')"
          sortable
          style="width: 120px"
        >
          <template #body="{ data }">
            <Tag
              :value="getStatusLabel(data.status)"
              :severity="getStatusSeverity(data.status)"
              rounded
            />
          </template>
        </Column>
        <Column :header="$t('admin.tours.columns.actions')" style="width: 130px">
          <template #body="{ data }">
            <div class="action-btns">
              <Button
                icon="pi pi-calendar"
                text
                rounded
                severity="info"
                size="small"
                @click="openSchedulesModal(data)"
                v-tooltip.top="$t('admin.tours.schedules.title')"
              />
              <Button
                icon="pi pi-pencil"
                text
                rounded
                severity="secondary"
                size="small"
                @click="openEditModal(data)"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                size="small"
                @click="handleDelete(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- DIALOG: Create/Edit Tour -->
    <Dialog
      v-model:visible="showModal"
      :header="isEditing ? $t('admin.tours.dialog.edit') : $t('admin.tours.dialog.create')"
      modal
      :style="{ width: '700px' }"
      :breakpoints="{ '768px': '95vw' }"
      :draggable="false"
    >
      <form @submit.prevent="submitForm" class="admin-tour-form">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-field md:col-span-1">
            <label>{{ $t('admin.tours.dialog.tourTitle') }} <span class="text-red-500">*</span></label>
            <InputText v-model="form.title" :placeholder="$t('admin.tours.dialog.enterName')" fluid />
          </div>
          <div class="form-field md:col-span-1">
            <label>Trạng thái</label>
            <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Chọn trạng thái" fluid />
          </div>

          <div class="form-field">
            <label>{{ $t('admin.tours.dialog.category') }} <span class="text-red-500">*</span></label>
            <Select
              v-model="form.categoryId"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              :placeholder="$t('admin.tours.dialog.selectCategory')"
              fluid
            />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.dialog.destination') }} <span class="text-red-500">*</span></label>
            <Select
              v-model="form.destinationId"
              :options="destinations"
              optionLabel="name"
              optionValue="id"
              :placeholder="$t('admin.tours.dialog.selectDestination')"
              fluid
            />
          </div>

          <div class="form-field">
            <label>Nơi khởi hành <span class="text-red-500">*</span></label>
            <InputText v-model="form.departureLocation" placeholder="vd: Hà Nội" fluid />
          </div>
          <div class="form-field">
            <label>Phương tiện <span class="text-red-500">*</span></label>
            <InputText v-model="form.transport" placeholder="vd: Ô tô, Máy bay" fluid />
          </div>

          <div class="form-field">
            <label>Mã Tour (tùy chọn)</label>
            <InputText v-model="form.tourCode" placeholder="vd: VTR-1234" fluid />
          </div>
          <div class="form-field">
            <label>Thời gian (tùy chọn)</label>
            <InputText v-model="form.duration" placeholder="vd: 3 Ngày 2 Đêm" fluid />
          </div>

          <div class="form-field md:col-span-1">
            <label>Giá Base (tùy chọn)</label>
            <InputNumber v-model="form.basePrice" mode="currency" currency="VND" locale="vi-VN" fluid />
          </div>
          <div class="form-field md:col-span-1">
             <label>Ảnh bìa Tour</label>
             <div class="upload-wrapper">
                <div class="preview-area" v-if="form.imageUrl">
                   <img :src="getFullImageUrl(form.imageUrl)" alt="Preview">
                   <Button icon="pi pi-times" severity="danger" rounded text class="remove-btn" @click="form.imageUrl = ''" />
                </div>
                <div v-else class="upload-placeholder" @click="triggerFileInput">
                   <i class="pi pi-cloud-upload"></i>
                   <span>Tải ảnh lên</span>
                </div>
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected">
                <div v-if="uploading" class="upload-overlay">
                   <ProgressSpinner strokeWidth="4" style="width: 30px; height: 30px;" />
                </div>
             </div>
          </div>

          <div class="form-field md:col-span-2">
            <label>{{ $t('admin.tours.dialog.description') }}</label>
            <Textarea
              v-model="form.description"
              :placeholder="$t('admin.tours.dialog.overview')"
              rows="3"
              fluid
            />
          </div>

          <div class="form-field md:col-span-1">
            <label>{{ $t('admin.tours.dialog.highlights') }}</label>
            <Textarea v-model="form.highlights" placeholder="Mỗi điểm một dòng..." rows="4" fluid />
          </div>
          <div class="form-field md:col-span-1">
            <label>{{ $t('admin.tours.dialog.policies') }}</label>
            <Textarea v-model="form.policies" placeholder="Chính sách tour..." rows="4" fluid />
          </div>

          <div class="form-field md:col-span-2">
            <label>{{ $t('admin.tours.dialog.itinerary') }}</label>
            <Textarea v-model="form.itinerary" placeholder="Mô tả lịch trình..." rows="4" fluid />
          </div>
        </div>
      </form>
      <template #footer>
        <Button v-if="isEditing" label="Quản lý Lịch khởi hành" icon="pi pi-calendar" severity="info" outlined @click="openSchedulesFromEdit" class="mr-auto" />
        <Button :label="$t('common.cancel')" severity="secondary" text @click="closeModal" />
        <Button
          :label="saving ? $t('admin.tours.dialog.saving') : $t('admin.tours.dialog.save')"
          icon="pi pi-check"
          @click="submitForm"
          :loading="saving"
          raised
        />
      </template>
    </Dialog>

    <!-- DIALOG: Manage Schedules -->
    <Dialog
      v-model:visible="showSchedulesModal"
      :header="$t('admin.tours.schedules.title') + ': ' + (selectedTour?.title || '')"
      modal
      :style="{ width: '850px' }"
      :breakpoints="{ '960px': '95vw' }"
      :draggable="false"
    >
      <!-- Existing Schedules -->
      <div class="schedule-section">
        <h4><i class="pi pi-list"></i> {{ $t('admin.tours.schedules.existing') }}</h4>
        <DataTable :value="selectedTour?.schedules || []" class="p-datatable-sm" stripedRows>
          <template #empty
            ><p class="empty-msg-sm">{{ $t('admin.tours.schedules.noSchedules') }}</p></template
          >
          <Column :header="$t('admin.tours.schedules.departure')">
            <template #body="{ data }">{{
              new Date(data.departureDate).toLocaleDateString()
            }}</template>
          </Column>
          <Column :header="$t('admin.tours.schedules.return')">
            <template #body="{ data }">{{
              new Date(data.returnDate).toLocaleDateString()
            }}</template>
          </Column>
          <Column :header="$t('admin.tours.schedules.seats')">
            <template #body="{ data }">{{ data.availableSeats }} / {{ data.totalSeats }}</template>
          </Column>
          <Column header="GIÁ VÉ" style="min-width: 180px">
            <template #body="{ data }">
              <div v-if="data.pricings?.length" class="flex flex-col gap-1">
                <div v-for="p in data.pricings" :key="p.passengerType" class="flex justify-between text-xs border-b border-slate-50 pb-1">
                  <span class="text-slate-500">
                    {{
                      p.passengerType === 1
                        ? 'Người lớn'
                        : p.passengerType === 2
                          ? 'Trẻ em'
                          : 'Em bé'
                    }}:
                  </span>
                  <span class="font-bold text-slate-700">{{ p.price?.toLocaleString('vi-VN') }} đ</span>
                </div>
              </div>
              <div v-else class="text-xs text-slate-400 italic">Chưa có bảng giá</div>
            </template>
          </Column>
          <Column header="" style="width: 60px">
            <template #body="{ data }">
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                size="small"
                @click="handleRemoveSchedule(data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <Divider />

      <!-- Add New Schedule -->
      <form @submit.prevent="submitScheduleForm" class="dialog-form">
        <h4><i class="pi pi-plus-circle"></i> {{ $t('admin.tours.schedules.addNew') }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.departure') }}</label>
            <DatePicker v-model="schForm.departureDate" dateFormat="dd/mm/yy" showIcon fluid />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.return') }}</label>
            <DatePicker v-model="schForm.returnDate" dateFormat="dd/mm/yy" showIcon fluid />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.totalSeats') }}</label>
            <InputNumber v-model="schForm.totalSeats" :min="1" fluid />
          </div>

          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.adult') }} (VND)</label>
            <InputNumber
              v-model="schForm.adultPrice"
              :min="0"
              mode="currency"
              currency="VND"
              locale="vi-VN"
              fluid
            />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.child') }} (VND)</label>
            <InputNumber
              v-model="schForm.childPrice"
              :min="0"
              mode="currency"
              currency="VND"
              locale="vi-VN"
              fluid
            />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.infant') }} (VND)</label>
            <InputNumber
              v-model="schForm.infantPrice"
              :min="0"
              mode="currency"
              currency="VND"
              locale="vi-VN"
              fluid
            />
          </div>
        </div>
        <div style="text-align: right; margin-top: 1rem">
          <Button
            type="submit"
            :label="
              addingSchedule ? $t('admin.tours.dialog.saving') : $t('admin.tours.schedules.addBtn')
            "
            icon="pi pi-plus"
            :loading="addingSchedule"
            severity="info"
          />
        </div>
      </form>
    </Dialog>

    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { tourApi } from '@/api/tourApi'
import { destinationApi } from '@/api/destinationApi'
import { categoryApi } from '@/api/categoryApi'
import { uploadApi } from '@/api/uploadApi'
import { getFullImageUrl } from '@/utils/imageHelper'
import { useI18n } from 'vue-i18n'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import Divider from 'primevue/divider'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()
const tours = ref([])
const destinations = ref([])
const categories = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref(null)
const statusOptions = computed(() => [
  { label: t('tour.status.published'), value: 2 },
  { label: t('tour.status.draft'), value: 1 },
  { label: t('tour.status.archived'), value: 3 },
])

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const uploading = ref(false)
const fileInput = ref(null)

// getFullImageUrl is now imported from shared helper

function triggerFileInput() {
  fileInput.value.click()
}

async function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    const res = await uploadApi.uploadFile(file)
    form.value.imageUrl = res.url
    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tải ảnh lên thành công', life: 2000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải ảnh lên', life: 3000 })
  } finally {
    uploading.value = false
    event.target.value = '' // Reset input
  }
}
const defaultForm = {
  title: '',
  categoryId: '',
  destinationId: '',
  description: '',
  highlights: '',
  itinerary: '',
  policies: '',
  departureLocation: '',
  transport: '',
  tourCode: '',
  duration: '',
  basePrice: null,
  status: 1,
}
const form = ref({ ...defaultForm })

async function fetchInitialData() {
  loading.value = true
  try {
    const [tourRes, destRes, catRes] = await Promise.all([
      tourApi.getAll({ pageSize: 1000 }),
      destinationApi.getAll(),
      categoryApi.getAll(),
    ])
    if (tourRes.success) tours.value = tourRes.data.items || tourRes.data || []
    if (destRes.success) destinations.value = destRes.data
    if (catRes && catRes.success !== false) categories.value = catRes.data || catRes
  } catch {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 })
  } finally {
    loading.value = false
  }
}

const filteredTours = computed(() =>
  tours.value.filter((t) => {
    const matchSearch = String(t.title).toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value ? t.status === statusFilter.value : true
    return matchSearch && matchStatus
  }),
)

function getStatusLabel(s) {
  return (
    { 1: t('tour.status.draft'), 2: t('tour.status.published'), 3: t('tour.status.archived') }[s] ||
    t('common.error')
  )
}
function getStatusSeverity(s) {
  return { 1: 'warn', 2: 'success', 3: 'secondary' }[s] || 'info'
}

function getTourCover(data) {
  if (data.imageUrl) return getFullImageUrl(data.imageUrl)
  const dest = destinations.value.find((d) => d.id === data.destinationId)
  return getFullImageUrl(dest?.coverImageUrl) || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=100&q=80'
}

function openCreateModal() {
  form.value = { ...defaultForm }
  isEditing.value = false
  editingId.value = null
  showModal.value = true
}
function openEditModal(tour) {
  form.value = {
    title: tour.title || '',
    categoryId: tour.categoryId || '',
    destinationId: tour.destinationId || '',
    description: tour.description || '',
    highlights: tour.highlights || '',
    itinerary: tour.itinerary || '',
    policies: tour.policies || '',
    departureLocation: tour.departureLocation || '',
    transport: tour.transport || '',
    tourCode: tour.tourCode || '',
    duration: tour.duration || '',
    basePrice: tour.basePrice || null,
    status: tour.status || 1,
  }
  isEditing.value = true
  editingId.value = tour.id
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (!form.value.title || !form.value.categoryId || !form.value.destinationId) {
    toast.add({
      severity: 'warn',
      summary: t('common.error'),
      detail: t('common.required'),
      life: 3000,
    })
    return
  }
  saving.value = true
  try {
    const payload = { ...form.value }
    const res = isEditing.value
      ? await tourApi.update(editingId.value, payload)
      : await tourApi.create(payload)
    if (res.success || (res.data && res.data.id !== undefined)) {
      toast.add({
        severity: 'success',
        summary: t('common.confirm'),
        detail: isEditing.value ? t('admin.tours.dialog.save') : t('admin.tours.dialog.create'),
        life: 3000,
      })
      closeModal()
      fetchInitialData()
    } else {
      toast.add({
        severity: 'error',
        summary: t('common.error'),
        detail: res.message || t('common.error'),
        life: 3000,
      })
    }
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: err.message || t('common.error'),
      life: 3000,
    })
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  confirm.require({
    message: t('common.confirm') + '?',
    header: t('common.delete'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: t('common.cancel'), severity: 'secondary', text: true },
    acceptProps: { label: t('common.delete'), severity: 'danger' },
    accept: async () => {
      try {
        const res = await tourApi.delete(id)
        if (res.success || res.message) {
          toast.add({
            severity: 'success',
            summary: t('common.confirm'),
            detail: t('common.confirm'),
            life: 3000,
          })
          fetchInitialData()
        }
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: t('common.error'),
          detail: err.message || t('common.error'),
          life: 4000,
        })
      }
    },
  })
}

// ---- Schedules ----
const showSchedulesModal = ref(false)
const selectedTour = ref(null)
const addingSchedule = ref(false)
const defaultSchForm = {
  departureDate: null,
  returnDate: null,
  totalSeats: 20,
  adultPrice: 0,
  childPrice: 0,
  infantPrice: 0,
}
const schForm = ref({ ...defaultSchForm })

function openSchedulesModal(tour) {
  selectedTour.value = tour
  schForm.value = { ...defaultSchForm }
  showSchedulesModal.value = true
}

function openSchedulesFromEdit() {
  const tour = tours.value.find(t => t.id === editingId.value)
  if (tour) {
    showModal.value = false
    openSchedulesModal(tour)
  }
}

// Watch Adult price to suggest Child/Infant prices (75% and 30%)
watch(() => schForm.value.adultPrice, (newVal) => {
  if (newVal > 0) {
    if (schForm.value.childPrice === 0) schForm.value.childPrice = Math.floor(newVal * 0.75)
    if (schForm.value.infantPrice === 0) schForm.value.infantPrice = Math.floor(newVal * 0.3)
  }
})

async function submitScheduleForm() {
  if (!schForm.value.departureDate || !schForm.value.returnDate) {
    toast.add({
      severity: 'warn',
      summary: t('common.error'),
      detail: t('common.required'),
      life: 3000,
    })
    return
  }
  addingSchedule.value = true
  try {
    const payload = {
      departureDate: schForm.value.departureDate,
      returnDate: schForm.value.returnDate,
      totalSeats: schForm.value.totalSeats,
      isActive: true,
      pricings: [
        { passengerType: 1, price: schForm.value.adultPrice },
        { passengerType: 2, price: schForm.value.childPrice },
        { passengerType: 3, price: schForm.value.infantPrice }
      ]
    }
    const res = await tourApi.addSchedule(selectedTour.value.id, payload)
    if (res.success || res.message) {
      toast.add({
        severity: 'success',
        summary: t('common.confirm'),
        detail: t('admin.tours.schedules.addNew'),
        life: 3000,
      })
      const tourRes = await tourApi.getById(selectedTour.value.id)
      if (tourRes.success || tourRes.data) selectedTour.value = tourRes.data || tourRes
      schForm.value = { ...defaultSchForm }
      fetchInitialData()
    } else {
      toast.add({
        severity: 'error',
        summary: t('common.error'),
        detail: res.message || t('common.error'),
        life: 3000,
      })
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('common.error'),
      life: 3000,
    })
  } finally {
    addingSchedule.value = false
  }
}

async function handleRemoveSchedule(scheduleId) {
  confirm.require({
    message: t('common.confirm') + '?',
    header: t('common.delete'),
    icon: 'pi pi-exclamation-circle',
    rejectProps: { label: t('common.cancel'), severity: 'secondary', text: true },
    acceptProps: { label: t('common.delete'), severity: 'danger' },
    accept: async () => {
      try {
        const res = await tourApi.removeSchedule(selectedTour.value.id, scheduleId)
        if (res.success || res.message) {
          toast.add({
            severity: 'success',
            summary: t('common.confirm'),
            detail: t('common.confirm'),
            life: 3000,
          })
          selectedTour.value.schedules = selectedTour.value.schedules.filter(
            (s) => s.id !== scheduleId,
          )
          fetchInitialData()
        } else {
          toast.add({
            severity: 'error',
            summary: t('common.error'),
            detail: res.message || t('common.error'),
            life: 3000,
          })
        }
      } catch {
        toast.add({
          severity: 'error',
          summary: t('common.error'),
          detail: t('common.error'),
          life: 3000,
        })
      }
    },
  })
}

onMounted(fetchInitialData)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.admin-tours-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fade-in-up 0.4s ease-out;
}
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-header {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
}
.empty-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: $color-text-secondary;
}
.empty-msg-sm {
  text-align: center;
  padding: 20px 0;
  color: $color-text-muted;
  font-size: 13px;
}
.id-badge {
  background: $color-bg-surface;
  padding: 2px 8px;
  border-radius: $border-radius-full;
  font-size: 12px;
  font-weight: 600;
  color: $color-text-secondary;
}
.t-thumbnail {
  width: 56px;
  height: 40px;
  border-radius: $border-radius-md;
  object-fit: cover;
}
.action-btns {
  display: flex;
  gap: 2px;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-row {
  display: flex;
  gap: 16px;
}
.form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-size: 12px;
    font-weight: 600;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .req {
    color: $color-danger;
  }
}

.schedule-section {
  h4 {
    margin-bottom: 12px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.upload-wrapper {
   position: relative; border: 2px dashed #e2e8f0; border-radius: 12px; height: 120px;
   @include flex-center; overflow: hidden; transition: all 0.2s;
   &:hover { border-color: $color-primary; background: #f8fafc; }
}

.upload-placeholder {
   display: flex; flex-direction: column; align-items: center; gap: 8px; color: #94a3b8; cursor: pointer;
   i { font-size: 1.5rem; }
   span { font-size: 0.8rem; font-weight: 600; }
}

.preview-area {
   width: 100%; height: 100%; position: relative;
   img { width: 100%; height: 100%; object-fit: cover; }
   .remove-btn { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.5) !important; color: white !important; }
}

.upload-overlay {
   position: absolute; inset: 0; background: rgba(255,255,255,0.7); @include flex-center;
}

.hidden { display: none; }
</style>
