<template>
  <div class="admin-tours-page">
    <div class="admin-page-header">
      <h1 class="page-title">{{ $t('admin.tours.title') }}</h1>
      <Button :label="$t('admin.tours.addTour')" icon="pi pi-plus" @click="openCreateModal" raised />
    </div>

    <div class="admin-card">
      <DataTable
        :value="filteredTours"
        :loading="loading"
        stripedRows removableSort
        :rows="10"
        :paginator="filteredTours.length > 10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 25, 50]"
        tableStyle="min-width: 60rem"
        class="p-datatable-sm"
      >
        <template #header>
          <div class="table-header">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchQuery" :placeholder="$t('admin.tours.searchPlaceholder')" />
            </IconField>
            <Select v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value"
              :placeholder="$t('admin.tours.allStatus')" showClear style="width: 160px" />
          </div>
        </template>

        <template #empty>
          <div class="empty-msg">
            <i class="pi pi-compass" style="font-size: 2rem; opacity: 0.3"></i>
            <p>{{ $t('admin.tours.noTours') }}</p>
          </div>
        </template>

        <Column field="id" :header="$t('admin.tours.columns.id')" sortable style="width: 80px">
          <template #body="{ data }"><span class="id-badge">#{{ data.id }}</span></template>
        </Column>
        <Column :header="$t('admin.tours.columns.cover')" style="width: 80px">
          <template #body="{ data }">
            <img :src="data.coverImage || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=100&q=80'" 
                 alt="tour" class="t-thumbnail" />
          </template>
        </Column>
        <Column field="title" :header="$t('admin.tours.columns.name')" sortable>
          <template #body="{ data }">
            <div><strong>{{ data.title }}</strong></div>
            <small style="color: var(--p-text-muted-color)">{{ data.categoryName }}</small>
          </template>
        </Column>
        <Column field="destinationName" :header="$t('admin.tours.columns.location')" sortable />
        <Column field="status" :header="$t('admin.tours.columns.status')" sortable style="width: 120px">
          <template #body="{ data }">
            <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" rounded />
          </template>
        </Column>
        <Column :header="$t('admin.tours.columns.actions')" style="width: 130px">
          <template #body="{ data }">
            <div class="action-btns">
              <Button icon="pi pi-calendar" text rounded severity="info" size="small" @click="openSchedulesModal(data)" v-tooltip.top="$t('admin.tours.schedules.title')" />
              <Button icon="pi pi-pencil" text rounded severity="secondary" size="small" @click="openEditModal(data)" />
              <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="handleDelete(data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- DIALOG: Create/Edit Tour -->
    <Dialog v-model:visible="showModal" :header="isEditing ? $t('admin.tours.dialog.edit') : $t('admin.tours.dialog.create')" modal
      :style="{ width: '700px' }" :breakpoints="{ '768px': '95vw' }" :draggable="false">
      <form @submit.prevent="submitForm" class="dialog-form">
        <div class="form-row">
          <div class="form-field">
            <label>{{ $t('admin.tours.dialog.tourTitle') }} <span class="req">*</span></label>
            <InputText v-model="form.title" :placeholder="$t('admin.tours.dialog.enterName')" fluid />
          </div>
          <div class="form-field" v-if="isEditing" style="max-width: 160px">
            <label>{{ $t('admin.tours.columns.status') }}</label>
            <Select v-model="form.status" :options="statusOptions"
              optionLabel="label" optionValue="value" fluid />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label>{{ $t('admin.tours.dialog.category') }} <span class="req">*</span></label>
            <Select v-model="form.categoryId" :options="categories" optionLabel="name" optionValue="id"
              :placeholder="$t('admin.tours.dialog.selectCategory')" fluid />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.dialog.destination') }} <span class="req">*</span></label>
            <Select v-model="form.destinationId" :options="destinations" optionLabel="name" optionValue="id"
              :placeholder="$t('admin.tours.dialog.selectDestination')" fluid />
          </div>
        </div>
        <div class="form-field">
          <label>{{ $t('admin.tours.dialog.description') }}</label>
          <Textarea v-model="form.description" rows="3" :placeholder="$t('admin.tours.dialog.overview')" fluid />
        </div>
        <div class="form-row">
          <div class="form-field">
            <label>{{ $t('admin.tours.dialog.highlights') }}</label>
            <Textarea v-model="form.highlights" rows="2" :placeholder="$t('admin.tours.dialog.highlights')" fluid />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.dialog.policies') }}</label>
            <Textarea v-model="form.policies" rows="2" :placeholder="$t('admin.tours.dialog.policies')" fluid />
          </div>
        </div>
        <div class="form-field">
          <label>{{ $t('admin.tours.dialog.itinerary') }}</label>
          <Textarea v-model="form.itinerary" rows="3" :placeholder="$t('admin.tours.dialog.itinerary')" fluid />
        </div>
      </form>
      <template #footer>
        <Button :label="$t('common.cancel')" severity="secondary" text @click="closeModal" />
        <Button :label="saving ? $t('admin.tours.dialog.saving') : $t('admin.tours.dialog.save')" icon="pi pi-check" @click="submitForm" :loading="saving" raised />
      </template>
    </Dialog>

    <!-- DIALOG: Manage Schedules -->
    <Dialog v-model:visible="showSchedulesModal" :header="$t('admin.tours.schedules.title') + ': ' + (selectedTour?.title || '')" modal
      :style="{ width: '850px' }" :breakpoints="{ '960px': '95vw' }" :draggable="false">
      
      <!-- Existing Schedules -->
      <div class="schedule-section">
        <h4><i class="pi pi-list"></i> {{ $t('admin.tours.schedules.existing') }}</h4>
        <DataTable :value="selectedTour?.schedules || []" class="p-datatable-sm" stripedRows>
          <template #empty><p class="empty-msg-sm">{{ $t('admin.tours.schedules.noSchedules') }}</p></template>
          <Column :header="$t('admin.tours.schedules.departure')">
            <template #body="{ data }">{{ new Date(data.departureDate).toLocaleDateString() }}</template>
          </Column>
          <Column :header="$t('admin.tours.schedules.return')">
            <template #body="{ data }">{{ new Date(data.returnDate).toLocaleDateString() }}</template>
          </Column>
          <Column :header="$t('admin.tours.schedules.seats')">
            <template #body="{ data }">{{ data.availableSeats }} / {{ data.totalSeats }}</template>
          </Column>
          <Column :header="$t('admin.tours.schedules.prices')">
            <template #body="{ data }">
              <div v-for="p in data.pricings" :key="p.passengerType" style="font-size: 12px">
                {{ p.passengerType === 1 ? $t('admin.tours.schedules.adult') : (p.passengerType === 2 ? $t('admin.tours.schedules.child') : $t('admin.tours.schedules.infant')) }}: ${{ p.price }}
              </div>
            </template>
          </Column>
          <Column header="" style="width: 60px">
            <template #body="{ data }">
              <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="handleRemoveSchedule(data.id)" />
            </template>
          </Column>
        </DataTable>
      </div>

      <Divider />

      <!-- Add New Schedule -->
      <form @submit.prevent="submitScheduleForm" class="dialog-form">
        <h4><i class="pi pi-plus-circle"></i> {{ $t('admin.tours.schedules.addNew') }}</h4>
        <div class="form-row">
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.departure') }}</label>
            <InputText type="date" v-model="schForm.departureDate" fluid />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.return') }}</label>
            <InputText type="date" v-model="schForm.returnDate" fluid />
          </div>
          <div class="form-field" style="max-width: 120px">
            <label>{{ $t('admin.tours.schedules.totalSeats') }}</label>
            <InputNumber v-model="schForm.totalSeats" :min="1" fluid />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.adult') }} ($)</label>
            <InputNumber v-model="schForm.adultPrice" :min="0" mode="currency" currency="USD" fluid />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.child') }} ($)</label>
            <InputNumber v-model="schForm.childPrice" :min="0" mode="currency" currency="USD" fluid />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.tours.schedules.infant') }} ($)</label>
            <InputNumber v-model="schForm.infantPrice" :min="0" mode="currency" currency="USD" fluid />
          </div>
        </div>
        <div style="text-align: right">
          <Button type="submit" :label="addingSchedule ? $t('admin.tours.dialog.saving') : $t('admin.tours.schedules.addBtn')" icon="pi pi-plus"
            :loading="addingSchedule" severity="info" />
        </div>
      </form>
    </Dialog>

    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { tourApi } from '@/api/tourApi'
import { destinationApi } from '@/api/destinationApi'
import { categoryApi } from '@/api/categoryApi'
import { useI18n } from 'vue-i18n'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import Divider from 'primevue/divider'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
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
  { label: t('tour.status.archived'), value: 3 }
])

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const defaultForm = { title: '', categoryId: '', destinationId: '', description: '', highlights: '', itinerary: '', policies: '', status: 1 }
const form = ref({ ...defaultForm })

async function fetchInitialData() {
  loading.value = true
  try {
    const [tourRes, destRes, catRes] = await Promise.all([tourApi.getAll(), destinationApi.getAll(), categoryApi.getAll()])
    if (tourRes.success) tours.value = tourRes.data
    if (destRes.success) destinations.value = destRes.data
    if (catRes && (catRes.success !== false)) categories.value = catRes.data || catRes
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 })
  } finally { loading.value = false }
}

const filteredTours = computed(() =>
  tours.value.filter(t => {
    const matchSearch = String(t.title).toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value ? t.status === statusFilter.value : true
    return matchSearch && matchStatus
  })
)

function getStatusLabel(s) { 
  return { 1: t('tour.status.draft'), 2: t('tour.status.published'), 3: t('tour.status.archived') }[s] || t('common.error') 
}
function getStatusSeverity(s) { return { 1: 'warn', 2: 'success', 3: 'secondary' }[s] || 'info' }

function openCreateModal() { form.value = { ...defaultForm }; isEditing.value = false; editingId.value = null; showModal.value = true }
function openEditModal(tour) {
  form.value = { title: tour.title || '', categoryId: tour.categoryId || '', destinationId: tour.destinationId || '', description: tour.description || '', highlights: tour.highlights || '', itinerary: tour.itinerary || '', policies: tour.policies || '', status: tour.status || 1 }
  isEditing.value = true; editingId.value = tour.id; showModal.value = true
}
function closeModal() { showModal.value = false }

async function submitForm() {
  if (!form.value.title || !form.value.categoryId || !form.value.destinationId) {
    toast.add({ severity: 'warn', summary: t('common.error'), detail: t('common.required'), life: 3000 }); return
  }
  saving.value = true
  try {
    const payload = { ...form.value }
    const res = isEditing.value ? await tourApi.update(editingId.value, payload) : await tourApi.create(payload)
    if (res.success || (res.data && res.data.id !== undefined)) {
      toast.add({ severity: 'success', summary: t('common.confirm'), detail: isEditing.value ? t('admin.tours.dialog.save') : t('admin.tours.dialog.create'), life: 3000 })
      closeModal(); fetchInitialData()
    } else { toast.add({ severity: 'error', summary: t('common.error'), detail: res.message || t('common.error'), life: 3000 }) }
  } catch (err) { toast.add({ severity: 'error', summary: t('common.error'), detail: err.message || t('common.error'), life: 3000 }) }
  finally { saving.value = false }
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
          toast.add({ severity: 'success', summary: t('common.confirm'), detail: t('common.confirm'), life: 3000 })
          fetchInitialData() 
        }
      } catch (err) { 
        toast.add({ severity: 'error', summary: t('common.error'), detail: err.message || t('common.error'), life: 4000 }) 
      }
    }
  })
}

// ---- Schedules ----
const showSchedulesModal = ref(false)
const selectedTour = ref(null)
const addingSchedule = ref(false)
const defaultSchForm = { departureDate: '', returnDate: '', totalSeats: 20, adultPrice: 0, childPrice: 0, infantPrice: 0 }
const schForm = ref({ ...defaultSchForm })

function openSchedulesModal(tour) { selectedTour.value = tour; schForm.value = { ...defaultSchForm }; showSchedulesModal.value = true }

async function submitScheduleForm() {
  if (!schForm.value.departureDate || !schForm.value.returnDate) {
    toast.add({ severity: 'warn', summary: t('common.error'), detail: t('common.required'), life: 3000 }); return
  }
  addingSchedule.value = true
  try {
    const res = await tourApi.addSchedule(selectedTour.value.id, { ...schForm.value })
    if (res.success || res.message) {
      toast.add({ severity: 'success', summary: t('common.confirm'), detail: t('admin.tours.schedules.addNew'), life: 3000 })
      const tourRes = await tourApi.getById(selectedTour.value.id)
      if (tourRes.success || tourRes.data) selectedTour.value = tourRes.data || tourRes
      schForm.value = { ...defaultSchForm }; fetchInitialData()
    } else { toast.add({ severity: 'error', summary: t('common.error'), detail: res.message || t('common.error'), life: 3000 }) }
  } catch { toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error'), life: 3000 }) }
  finally { addingSchedule.value = false }
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
          toast.add({ severity: 'success', summary: t('common.confirm'), detail: t('common.confirm'), life: 3000 })
          selectedTour.value.schedules = selectedTour.value.schedules.filter(s => s.id !== scheduleId)
          fetchInitialData()
        } else { toast.add({ severity: 'error', summary: t('common.error'), detail: res.message || t('common.error'), life: 3000 }) }
      } catch { toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error'), life: 3000 }) }
    }
  })
}

onMounted(fetchInitialData)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.admin-tours-page { animation: fade-in-up 0.4s ease-out; }
@keyframes fade-in-up { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

.table-header { display: flex; justify-content: flex-end; gap: 12px; align-items: center; }
.empty-msg { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 0; color: $color-text-secondary; }
.empty-msg-sm { text-align: center; padding: 20px 0; color: $color-text-muted; font-size: 13px; }
.id-badge { background: $color-bg-surface; padding: 2px 8px; border-radius: $border-radius-full; font-size: 12px; font-weight: 600; color: $color-text-secondary; }
.t-thumbnail { width: 56px; height: 40px; border-radius: $border-radius-md; object-fit: cover; }
.action-btns { display: flex; gap: 2px; }

.dialog-form { display: flex; flex-direction: column; gap: 18px; }
.form-row { display: flex; gap: 16px; }
.form-field {
  flex: 1; display: flex; flex-direction: column; gap: 6px;
  label { font-size: 12px; font-weight: 600; color: $color-text-secondary; text-transform: uppercase; letter-spacing: 0.04em; }
  .req { color: $color-danger; }
}

.schedule-section { h4 { margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; gap: 8px; } }
</style>
