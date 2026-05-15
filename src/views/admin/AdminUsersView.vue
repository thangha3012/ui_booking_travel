<template>
  <div class="admin-users-page">
    <div class="admin-page-header">
      <h1 class="page-title">{{ $t('admin.users.title') }}</h1>
      <Button :label="$t('admin.users.addUser')" icon="pi pi-plus" disabled raised />
    </div>

    <div class="admin-card">
      <DataTable
        :value="filteredUsers"
        :loading="loading"
        stripedRows
        removableSort
        :rows="10"
        :paginator="filteredUsers.length > 10"
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
              <InputText v-model="searchQuery" :placeholder="$t('admin.users.searchPlaceholder')" />
            </IconField>
            <Select v-model="roleFilter" :options="roleOptions" optionLabel="label" optionValue="value"
              :placeholder="$t('admin.users.allRoles')" showClear style="width: 180px" />
          </div>
        </template>

        <template #empty>
          <div class="empty-msg">
            <i class="pi pi-users" style="font-size: 2rem; opacity: 0.3"></i>
            <p>{{ $t('admin.users.noUsers') }}</p>
          </div>
        </template>

        <Column :header="$t('admin.users.columns.user')" sortable field="fullName">
          <template #body="{ data }">
            <div class="user-cell">
              <Avatar :image="`https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=235789&color=fff`" 
                shape="circle" size="normal" />
              <div class="u-info">
                <span class="font-bold">{{ data.fullName }}</span>
                <small class="text-slate-400">ID: #{{ data.id }}</small>
              </div>
            </div>
          </template>
        </Column>

        <Column :header="$t('admin.users.columns.contact')" field="email">
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2"><i class="pi pi-envelope text-xs"></i> {{ data.email }}</div>
              <div class="flex items-center gap-2 text-xs text-slate-400" v-if="data.phone">
                <i class="pi pi-phone text-[10px]"></i> {{ data.phone }}
              </div>
              <div class="text-xs italic text-slate-300" v-else>{{ $t('admin.users.noPhone') }}</div>
            </div>
          </template>
        </Column>

        <Column field="role" :header="$t('admin.users.columns.role')" sortable style="width: 140px">
          <template #body="{ data }">
            <Tag :value="data.role === 'Admin' ? $t('admin.users.roles.admin') : $t('admin.users.roles.standard')" :severity="data.role === 'Admin' ? 'info' : 'secondary'" rounded />
          </template>
        </Column>

        <Column field="isActive" :header="$t('admin.users.columns.status')" sortable style="width: 140px">
          <template #body="{ data }">
            <Tag :value="data.isActive ? $t('admin.users.status.active') : $t('admin.users.status.locked')" 
              :severity="data.isActive ? 'success' : 'danger'" rounded />
          </template>
        </Column>

        <Column field="createdAt" :header="$t('admin.users.columns.joined')" sortable>
          <template #body="{ data }">
            {{ new Date(data.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US') }}
          </template>
        </Column>

        <Column :header="$t('admin.users.columns.actions')" style="width: 100px" alignHeader="center" bodyStyle="text-align: center">
          <template #body="{ data }">
            <Button 
              :icon="data.isActive ? 'pi pi-lock' : 'pi pi-lock-open'" 
              text rounded 
              :severity="data.isActive ? 'danger' : 'success'" 
              size="small"
              @click="toggleStatus(data)"
              :disabled="data.role === 'Admin'"
              v-tooltip.top="data.isActive ? $t('admin.users.lockTooltip') : $t('admin.users.unlockTooltip')"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { userApi } from '@/api/userApi'
import { useI18n } from 'vue-i18n'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const { t, locale } = useI18n()
const toast = useToast()
const confirm = useConfirm()

const users = ref([])
const loading = ref(true)
const searchQuery = ref('')
const roleFilter = ref(null)
const roleOptions = computed(() => [
  { label: t('admin.users.roles.admin'), value: 'Admin' },
  { label: t('admin.users.roles.standard'), value: 'Customer' }
])

async function fetchUsers() {
  loading.value = true
  try {
    const res = await userApi.getAll()
    if (res.success && res.data) {
      users.value = res.data
    } else if (res && Array.isArray(res)) {
       users.value = res
    } else if (res && res.data) {
       users.value = res.data
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error'), life: 4000 })
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchSearch = String(u.fullName || '').toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        String(u.email || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchRole = roleFilter.value ? u.role === roleFilter.value : true
    return matchSearch && matchRole
  })
})

async function toggleStatus(user) {
  if (user.role === 'Admin') {
    toast.add({ severity: 'warn', summary: t('common.error'), detail: t('common.error'), life: 3000 })
    return
  }
  
  confirm.require({
    message: t('common.confirm') + '?',
    header: t('common.confirm'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: t('common.cancel'), severity: 'secondary', text: true },
    acceptProps: { label: t('common.confirm'), severity: user.isActive ? 'danger' : 'success' },
    accept: async () => {
      try {
        const res = await userApi.toggleStatus(user.id)
        if (res.success || res.message) {
          toast.add({ severity: 'success', summary: t('common.confirm'), detail: t('common.confirm'), life: 3000 })
          fetchUsers()
        }
      } catch (err) {
        toast.add({ severity: 'error', summary: t('common.error'), detail: err.message || t('common.error'), life: 4000 })
      }
    }
  })
}

onMounted(fetchUsers)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.admin-users-page { 
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fade-in-up 0.4s ease-out; 
}
@keyframes fade-in-up { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

.table-header { display: flex; justify-content: flex-end; gap: 12px; align-items: center; }

.user-cell {
  display: flex; align-items: center; gap: 12px;
  .u-info { display: flex; flex-direction: column; line-height: 1.2; }
}

.empty-msg {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 48px 0; color: $color-text-secondary;
}

:deep(.p-datatable-header) {
  background: white; border: none; padding: 1.25rem 0;
}
</style>
