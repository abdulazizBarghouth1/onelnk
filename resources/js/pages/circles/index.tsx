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

export default function Circles() {
  const { t } = useTranslation();
  const { auth, circles = [], businesses = [], summary = {}, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];

  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const multiBusiness = (businesses || []).length > 1;
  // Only a positive cap with nothing left is "at limit"; -1 (unlimited),
  // 0/undefined caps don't block here — the server is the source of truth.
  const atLimit = (summary.max ?? -1) > 0 && (summary.remaining ?? 1) <= 0;

  const navigate = (overrides: Record<string, any> = {}) => {
    const search = overrides.search ?? searchTerm;
    const params: any = { page: 1 };
    if (search) params.search = search;
    router.get(route('circles.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleAddNew = () => {
    if (atLimit) {
      toast.error(t('You have reached your plan limit of {{max}} circles.', { max: summary.max }));
      return;
    }
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
      toast.loading(t('Creating circle...'));
      router.post(route('circles.store'), formData, {
        preserveScroll: true,
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Circle created successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(Object.values(errors).join(', '));
        },
      });
    } else {
      toast.loading(t('Updating circle...'));
      router.put(route('circles.update', currentItem.id), formData, {
        preserveScroll: true,
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Circle updated successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(Object.values(errors).join(', '));
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting circle...'));
    router.delete(route('circles.destroy', currentItem.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        toast.success(t('Circle deleted successfully'));
      },
      onError: () => {
        toast.dismiss();
        toast.error(t('Failed to delete circle'));
      },
    });
  };

  const columns = [
    {
      key: 'name',
      label: t('Name'),
      sortable: false,
      render: (_v: any, row: any) => (
        <span className="inline-flex items-center gap-2 font-medium">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: row.color || '#64748b' }} />
          {row.name}
        </span>
      ),
    },
    ...(multiBusiness
      ? [{ key: 'business_name', label: t('Business'), render: (_v: any, row: any) => row.business_name || '—' }]
      : []),
    { key: 'contacts_count', label: t('Contacts'), render: (v: number) => v ?? 0 },
    { key: 'creator_name', label: t('Created By'), render: (v: string) => v || '—' },
  ];

  const actions = [
    {
      label: t('Export CSV'),
      icon: 'Download',
      href: (row: any) => route('circles.export', { circle: row.id, format: 'csv' }),
      openInNewTab: true,
      permission: 'view-circles',
    },
    {
      label: t('Export vCard'),
      icon: 'Contact',
      href: (row: any) => route('circles.export', { circle: row.id, format: 'vcard' }),
      openInNewTab: true,
      permission: 'view-circles',
    },
    { label: t('Edit'), icon: 'Pencil', action: 'edit', className: 'text-amber-500', permission: 'edit-circles' },
    { label: t('Delete'), icon: 'Trash2', action: 'delete', className: 'text-red-500', permission: 'delete-circles' },
  ];

  const stat = (label: string, value: any) => (
    <div className="rounded-lg border bg-white dark:bg-gray-900 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );

  return (
    <PageTemplate
      title={t('Circles')}
      url="/circles"
      description={t('Group contacts into segments like “Event X”.')}
      actions={[{ label: t('Create Circle'), icon: <Plus className="h-4 w-4 mr-2" />, variant: 'default', onClick: handleAddNew }]}
      breadcrumbs={[{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Circles') }]}
      noPadding
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {stat(t('Total Circles'), summary.total ?? 0)}
        {stat(t('Created By You'), summary.mine ?? 0)}
        {stat(t('Created By Team'), summary.team ?? 0)}
        {stat(t('Remaining'), summary.max === -1 ? t('Unlimited') : summary.remaining ?? 0)}
      </div>

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
          data={circles || []}
          from={1}
          onAction={handleAction}
          permissions={permissions}
          entityPermissions={{ view: 'view-circles', edit: 'edit-circles', delete: 'delete-circles' }}
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
            { name: 'name', label: t('Name'), type: 'text', placeholder: t('e.g. Event X, Clients'), required: true },
            { name: 'description', label: t('Description'), type: 'textarea', placeholder: t('Optional') },
            {
              name: 'color',
              label: t('Color'),
              type: 'custom',
              render: (_f: any, formData: any, handleChange: any) => (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color || '#0D9488'}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="h-9 w-12 rounded border p-1"
                  />
                  <span className="text-sm text-muted-foreground">{formData.color || t('Auto')}</span>
                </div>
              ),
            },
          ],
          modalSize: 'lg',
        }}
        initialData={currentItem}
        title={formMode === 'create' ? t('Create Circle') : t('Edit Circle')}
        mode={formMode}
      />

      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName="circle"
      />
    </PageTemplate>
  );
}
