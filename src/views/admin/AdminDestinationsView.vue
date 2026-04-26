<template>
  <div class="admin-destinations-page">
    <div class="admin-page-header">
      <h1 class="page-title">{{ $t('admin.destinations.title') }}</h1>
      <Button
        :label="$t('admin.destinations.addBtn')"
        icon="pi pi-plus"
        @click="openCreateModal"
        raised
      />
    </div>

    <div class="admin-card">
      <DataTable
        :value="filteredDestinations"
        :loading="loading"
        stripedRows
        removableSort
        :rows="10"
        :paginator="filteredDestinations.length > 10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        tableStyle="min-width: 50rem"
        class="p-datatable-sm"
      >
        <template #header>
          <div class="table-header">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                :placeholder="$t('admin.destinations.searchPlaceholder')"
              />
            </IconField>
          </div>
        </template>

        <template #empty>
          <div class="empty-msg">
            <i class="pi pi-map-marker" style="font-size: 2rem; opacity: 0.3"></i>
            <p>{{ $t('admin.destinations.noData') }}</p>
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
              :src="
                data.coverImageUrl ||
                'https://images.unsplash.com/photo-1555921015-5532091f6026?w=100&q=80'
              "
              alt="cover"
              class="t-thumbnail"
            />
          </template>
        </Column>
        <Column field="name" :header="$t('admin.destinations.columns.name')" sortable>
          <template #body="{ data }"
            ><strong>{{ data.name }}</strong></template
          >
        </Column>
        <Column :header="$t('admin.destinations.columns.location')" sortable field="province">
          <template #body="{ data }">{{ data.province }}, {{ data.country }}</template>
        </Column>
        <Column :header="$t('admin.tours.columns.actions')" style="width: 100px">
          <template #body="{ data }">
            <div class="action-btns">
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

    <!-- PrimeVue Dialog -->
    <Dialog
      v-model:visible="showModal"
      :header="
        isEditing ? $t('admin.destinations.dialog.edit') : $t('admin.destinations.dialog.create')
      "
      modal
      :style="{ width: '600px' }"
      :breakpoints="{ '640px': '95vw' }"
      :draggable="false"
    >
      <form @submit.prevent="submitForm" class="dialog-form">
        <div class="form-row">
          <div class="form-field">
            <label>{{ $t('admin.destinations.dialog.name') }} <span class="req">*</span></label>
            <InputText
              v-model="form.name"
              :placeholder="$t('admin.destinations.dialog.name')"
              fluid
            />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.destinations.dialog.coverUrl') }}</label>
            <InputText v-model="form.coverImageUrl" placeholder="https://..." fluid />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label>{{ $t('admin.destinations.dialog.province') }} <span class="req">*</span></label>
            <InputText
              v-model="form.province"
              :placeholder="$t('admin.destinations.dialog.province')"
              fluid
            />
          </div>
          <div class="form-field">
            <label>{{ $t('admin.destinations.dialog.country') }} <span class="req">*</span></label>
            <InputText
              v-model="form.country"
              :placeholder="$t('admin.destinations.dialog.country')"
              fluid
            />
          </div>
        </div>
        <div class="form-field">
          <label>{{ $t('admin.destinations.dialog.desc') }}</label>
          <Textarea
            v-model="form.description"
            rows="3"
            :placeholder="$t('admin.destinations.dialog.descPlaceholder')"
            fluid
          />
        </div>
      </form>
      <template #footer>
        <Button :label="$t('common.cancel')" severity="secondary" text @click="closeModal" />
        <Button
          :label="saving ? $t('admin.tours.dialog.saving') : $t('admin.destinations.dialog.save')"
          icon="pi pi-check"
          @click="submitForm"
          :loading="saving"
          raised
        />
      </template>
    </Dialog>

    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { destinationApi } from '@/api/destinationApi'
import { useI18n } from 'vue-i18n'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()
const destinations = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const defaultForm = {
  name: '',
  description: '',
  country: 'Vietnam',
  province: '',
  coverImageUrl: '',
  latitude: null,
  longitude: null,
}
const form = ref({ ...defaultForm })

async function fetchDestinations() {
  loading.value = true
  try {
    const res = await destinationApi.getAll()
    if (res && res.success) destinations.value = res.data
    else if (res && res.data) destinations.value = res.data
    else destinations.value = res
  } catch {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('common.error'),
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const filteredDestinations = computed(() =>
  destinations.value.filter(
    (d) =>
      String(d.name).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(d.province).toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)

function openCreateModal() {
  form.value = { ...defaultForm }
  isEditing.value = false
  editingId.value = null
  showModal.value = true
}
function openEditModal(dest) {
  form.value = {
    name: dest.name || '',
    description: dest.description || '',
    country: dest.country || 'Vietnam',
    province: dest.province || '',
    coverImageUrl: dest.coverImageUrl || '',
    latitude: dest.latitude,
    longitude: dest.longitude,
  }
  isEditing.value = true
  editingId.value = dest.id
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (!form.value.name || !form.value.province) {
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
      ? await destinationApi.update(editingId.value, payload)
      : await destinationApi.create(payload)
    if (res.success || (res.data && res.data.id !== undefined)) {
      toast.add({
        severity: 'success',
        summary: t('common.confirm'),
        detail: isEditing.value
          ? t('admin.destinations.dialog.save')
          : t('admin.destinations.dialog.create'),
        life: 3000,
      })
      closeModal()
      fetchDestinations()
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
    header: t('common.confirm'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: t('common.cancel'), severity: 'secondary', text: true },
    acceptProps: { label: t('common.delete'), severity: 'danger' },
    accept: async () => {
      try {
        const res = await destinationApi.delete(id)
        if (res.success) {
          toast.add({
            severity: 'success',
            summary: t('common.confirm'),
            detail: t('common.confirm'),
            life: 3000,
          })
          fetchDestinations()
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
          life: 4000,
        })
      }
    },
  })
}

onMounted(fetchDestinations)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.admin-destinations-page {
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
}
.empty-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: $color-text-secondary;
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
  gap: 4px;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
</style>
