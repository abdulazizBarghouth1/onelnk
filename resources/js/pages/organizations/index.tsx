import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Plus } from 'lucide-react';
import { CrudTable } from '@/components/CrudTable';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

export default function Organizations() {
  const { t } = useTranslation();
  const { auth, organizations = [], businesses = [], filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];

  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const multiBusiness = (businesses || []).length > 1;

  const navigate = (overrides: Record<string, any> = {}) => {
    const search = overrides.search ?? searchTerm;
    const params: any = { page: 1 };
    if (search) params.search = search;
    router.get(route('organizations.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleAddNew = () => {
    setCurrentItem(businesses.length === 1 ? { business_id: businesses[0].id.toString() } : null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleAction = (action: string, item: any) => {
    setCurrentItem({ ...item, business_id: item.business_id?.toString() });
    if (action === 'edit') {
      setFormMode('edit');
      setIsFormModalOpen(true);
    } else if (action === 'delete') {
      setIsDeleteModalOpen(true);
    }
  };

  const handleFormSubmit = (formData: any) => {
    if (formMode === 'create') {
      toast.loading(t('Creating company...'));
      router.post(route('organizations.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(Object.values(errors).join(', '));
        },
      });
    } else {
      toast.loading(t('Updating company...'));
      router.put(route('organizations.update', currentItem.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(Object.values(errors).join(', '));
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting company...'));
    router.delete(route('organizations.destroy', currentItem.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
      },
      onError: () => {
        toast.dismiss();
        toast.error(t('Failed to delete company'));
      },
    });
  };

  const columns = [
    { key: 'name', label: t('Company'), render: (_v: any, row: any) => <span className="font-medium">{row.name}</span> },
    ...(multiBusiness
      ? [{ key: 'business_name', label: t('Business'), render: (_v: any, row: any) => row.business_name || '—' }]
      : []),
    { key: 'email', label: t('Email'), render: (v: string) => v || '—' },
    { key: 'phone', label: t('Phone'), render: (v: string) => v || '—' },
    { key: 'contacts_count', label: t('Contacts'), render: (v: number) => v ?? 0 },
  ];

  const actions = [
    { label: t('Edit'), icon: 'Pencil', action: 'edit', className: 'text-amber-500', permission: 'edit-organizations' },
    { label: t('Delete'), icon: 'Trash2', action: 'delete', className: 'text-red-500', permission: 'delete-organizations' },
  ];

  return (
    <PageTemplate
      title={t('Companies')}
      url="/organizations"
      description={t('Companies your contacts belong to.')}
      actions={[{ label: t('Create Company'), icon: <Plus className="h-4 w-4 mr-2" />, variant: 'default', onClick: handleAddNew }]}
      breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Companies') }]}
      noPadding
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={(e: React.FormEvent) => {
            e.preventDefault();
            navigate();
          }}
          filters={[]}
          showFilters={false}
          setShowFilters={() => {}}
          hasActiveFilters={() => searchTerm !== ''}
          activeFilterCount={() => (searchTerm ? 1 : 0)}
          onResetFilters={() => {
            setSearchTerm('');
            navigate({ search: '' });
          }}
          onApplyFilters={() => navigate()}
          currentPerPage="10"
          onPerPageChange={() => {}}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={organizations || []}
          from={1}
          onAction={handleAction}
          permissions={permissions}
          entityPermissions={{ view: 'view-organizations', edit: 'edit-organizations', delete: 'delete-organizations' }}
        />
      </div>

      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formConfig={{
          fields: [
            {
              name: 'business_id',
              label: t('Business'),
              type: 'select',
              required: true,
              options: (businesses || []).map((b: any) => ({ value: b.id.toString(), label: b.name })),
              conditional: () => multiBusiness || formMode === 'create',
            },
            { name: 'name', label: t('Company Name'), type: 'text', placeholder: t('e.g. Acme Inc'), required: true },
            { name: 'website', label: t('Website'), type: 'text', placeholder: 'https://' },
            { name: 'email', label: t('Email'), type: 'email', placeholder: t('Enter email address') },
            { name: 'phone', label: t('Phone'), type: 'text', placeholder: t('Enter phone number') },
            { name: 'notes', label: t('Notes'), type: 'textarea', placeholder: t('Optional') },
          ],
          modalSize: 'lg',
        }}
        initialData={currentItem}
        title={formMode === 'create' ? t('Create Company') : t('Edit Company')}
        mode={formMode}
      />

      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName="company"
      />
    </PageTemplate>
  );
}
