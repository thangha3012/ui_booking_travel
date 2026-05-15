<template>
  <div class="admin-categories-page">
    <div class="admin-page-header">
      <h1 class="page-title">{{ $t('admin.categories.title') }}</h1>
      <Button :label="$t('admin.categories.addBtn')" icon="pi pi-plus" @click="openCreateModal" raised />
    </div>

    <div class="admin-card">
      <DataTable
        :value="filteredCategories"
        :loading="loading"
        stripedRows
        removableSort
        :rows="10"
        :paginator="filteredCategories.length > 10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        :globalFilterFields="['name', 'description']"
        tableStyle="min-width: 50rem"
        class="p-datatable-sm"
        scrollable
        scrollHeight="flex"
      >
        <template #header>
          <div class="table-header">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchQuery" :placeholder="$t('admin.categories.searchPlaceholder')" />
            </IconField>
          </div>
        </template>

        <template #empty>
          <div class="empty-msg">
            <i class="pi pi-inbox" style="font-size: 2rem; opacity: 0.3"></i>
            <p>{{ $t('admin.categories.noData') }}</p>
          </div>
        </template>

        <Column field="id" :header="$t('admin.tours.columns.id')" sortable style="width: 80px">
          <template #body="{ data }">
            <span class="id-badge">#{{ data.id }}</span>
          </template>
        </Column>
        <Column field="name" :header="$t('admin.categories.columns.name')" sortable>
          <template #body="{ data }">
            <strong>{{ data.name }}</strong>
          </template>
        </Column>
        <Column field="description" :header="$t('admin.categories.columns.description')">
          <template #body="{ data }">
            <span class="desc-text">{{ data.description || '—' }}</span>
          </template>
        </Column>
        <Column field="isActive" :header="$t('admin.categories.columns.status')" sortable style="width: 120px">
          <template #body="{ data }">
            <Tag :value="data.isActive ? $t('admin.users.status.active') : $t('admin.users.status.locked')" 
                 :severity="data.isActive ? 'success' : 'danger'" rounded />
          </template>
        </Column>
        <Column :header="$t('admin.tours.columns.actions')" style="width: 100px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="action-btns">
              <Button icon="pi pi-pencil" text rounded aria-label="Edit"  severity="secondary" size="small" @click="openEditModal(data)" />
              <Button icon="pi pi-trash" text rounded aria-label="Delete" severity="danger" size="small" @click="handleDelete(data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- PrimeVue Dialog: Add/Edit Category -->
    <Dialog v-model:visible="showModal" :header="isEditing ? $t('admin.categories.dialog.edit') : $t('admin.categories.dialog.create')" modal :style="{ width: '520px' }"
      :breakpoints="{ '640px': '95vw' }" :draggable="false" class="category-dialog">
      <form @submit.prevent="submitForm" class="dialog-form">
        <div class="form-row">
          <div class="form-field">
            <label for="catName">{{ $t('admin.categories.dialog.name') }} <span class="required">*</span></label>
            <InputText id="catName" v-model="form.name" :placeholder="$t('admin.categories.dialog.enterName')" fluid />
          </div>
          <div class="form-field" style="max-width: 140px">
            <label for="catOrder">{{ $t('admin.categories.dialog.order') }}</label>
            <InputNumber id="catOrder" v-model="form.displayOrder" :min="0" :max="999" fluid />
          </div>
        </div>
        <div class="form-field">
          <label for="catDesc">{{ $t('admin.categories.columns.description') }}</label>
          <Textarea id="catDesc" v-model="form.description" rows="3" :placeholder="$t('admin.categories.dialog.descPlaceholder')" fluid />
        </div>
        <div class="form-field">
          <div class="flex items-center gap-3">
            <ToggleSwitch v-model="form.isActive" inputId="catActive" />
            <label for="catActive" class="mb-0 cursor-pointer" style="text-transform: none; letter-spacing: normal;">
              {{ form.isActive ? $t('admin.users.status.active') : $t('admin.users.status.locked') }}
            </label>
          </div>
        </div>
      </form>

      <template #footer>
        <Button :label="$t('common.cancel')" severity="secondary" text @click="closeModal" />
        <Button :label="saving ? $t('admin.tours.dialog.saving') : $t('admin.categories.dialog.save')" icon="pi pi-check" @click="submitForm" :loading="saving" raised />
      </template>
    </Dialog>

    <!-- PrimeVue Toast -->
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { categoryApi } from '@/api/categoryApi'
import { useI18n } from 'vue-i18n'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'
import Toast from 'primevue/toast'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { useToast as usePrimeToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const { t } = useI18n()
const primeToast = usePrimeToast()
const confirm = useConfirm()
const categories = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const defaultForm = { name: '', description: '', displayOrder: 0, parentId: null, isActive: true }
const form = ref({ ...defaultForm })

async function fetchCategories() {
  loading.value = true
  try {
    const res = await categoryApi.getAll()
    if (res && res.success) categories.value = res.data
    else if (res && res.data) categories.value = res.data
    else categories.value = res
  } catch {
    primeToast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error'), life: 3000 })
  } finally {
    loading.value = false
  }
}

const filteredCategories = computed(() =>
  categories.value.filter(c => String(c.name).toLowerCase().includes(searchQuery.value.toLowerCase()))
)

function openCreateModal() { form.value = { ...defaultForm }; isEditing.value = false; editingId.value = null; showModal.value = true }
function openEditModal(cat) {
  form.value = { 
    name: cat.name || '', 
    description: cat.description || '', 
    displayOrder: cat.displayOrder || 0,
    parentId: cat.parentId || null,
    isActive: cat.isActive !== undefined ? cat.isActive : true
  }
  isEditing.value = true
  editingId.value = cat.id
  showModal.value = true
}
function closeModal() { showModal.value = false }

async function handleDelete(id) {
  confirm.require({
    message: t('common.confirm') + '?',
    header: t('common.confirm'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: t('common.cancel'), severity: 'secondary', text: true },
    acceptProps: { label: t('common.delete'), severity: 'danger' },
    accept: async () => {
      try {
        const res = await categoryApi.delete(id)
        if (res.success || res.message) {
          primeToast.add({ severity: 'success', summary: t('common.confirm'), detail: t('common.confirm'), life: 3000 })
          fetchCategories()
        }
      } catch (err) {
        primeToast.add({ severity: 'error', summary: t('common.error'), detail: err.message || t('common.error'), life: 3000 })
      }
    }
  })
}

async function submitForm() {
  if (!form.value.name) {
    primeToast.add({ severity: 'warn', summary: t('common.error'), detail: t('common.required'), life: 3000 })
    return
  }
  saving.value = true
  try {
    const res = isEditing.value 
      ? await categoryApi.update(editingId.value, { ...form.value })
      : await categoryApi.create({ ...form.value })
      
    if (res.success || (res.data && res.data.id)) {
      primeToast.add({ severity: 'success', summary: t('common.confirm'), detail: isEditing.value ? t('admin.categories.dialog.save') : t('admin.categories.dialog.create'), life: 3000 })
      closeModal()
      fetchCategories()
    } else {
      primeToast.add({ severity: 'error', summary: t('common.error'), detail: res.message || t('common.error'), life: 3000 })
    }
  } catch (err) {
    primeToast.add({ severity: 'error', summary: t('common.error'), detail: err.message || t('common.error'), life: 3000 })
  } finally { saving.value = false }
}

onMounted(fetchCategories)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.admin-categories-page { 
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fade-in-up 0.4s ease-out; 
}
@keyframes fade-in-up { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

.table-header {
  display: flex; justify-content: flex-end;
}

.empty-msg {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 40px 0; color: $color-text-secondary;
}

.id-badge {
  background: $color-bg-surface; padding: 2px 8px; border-radius: $border-radius-full;
  font-size: 12px; font-weight: 600; color: $color-text-secondary;
}

.desc-text { color: $color-text-body; font-size: 13px; }

.action-btns { display: flex; gap: 4px; }

// Dialog form
.dialog-form { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: flex; gap: 16px; }
.form-field {
  flex: 1; display: flex; flex-direction: column; gap: 6px;
  label { font-size: 12px; font-weight: 600; color: $color-text-secondary; text-transform: uppercase; letter-spacing: 0.04em; }
  .required { color: $color-danger; }
}
</style>
