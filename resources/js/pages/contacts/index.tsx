import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Plus, X } from 'lucide-react';
import { CrudTable } from '@/components/CrudTable';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { ContactReplyModal } from '@/components/ContactReplyModal';
import { CreatableMultiSelect } from '@/components/creatable-multi-select';
import { PhoneInput } from '@/components/phone-input';
import { Dialog } from '@/components/ui/dialog';
import View from './View';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

/**
 * A small list editor for the "additional emails / phones" fields: rows the
 * user can add and remove on the fly. Stores a plain string[] in the form.
 */
function RepeatableList({
  values,
  onChange,
  placeholder,
  inputType = 'text',
  addLabel,
  renderInput,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  inputType?: string;
  addLabel: string;
  renderInput?: (value: string, onValueChange: (v: string) => void) => React.ReactNode;
}) {
  const rows = Array.isArray(values) ? values : [];
  const setRow = (i: number, v: string) => {
    const next = [...rows];
    next[i] = v;
    onChange(next);
  };
  const addRow = () => onChange([...rows, '']);
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {rows.map((val, i) => (
        <div key={i} className="flex items-center gap-2">
          {renderInput ? (
            <div className="w-full">{renderInput(val || '', (v) => setRow(i, v))}</div>
          ) : (
            <input
              type={inputType}
              value={val || ''}
              onChange={(e) => setRow(i, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary dark:bg-gray-900"
            />
          )}
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="shrink-0 rounded-md border px-2 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            aria-label="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

export default function Contacts() {
  const { t } = useTranslation();
  const {
    auth,
    contacts,
    businesses,
    circles = [],
    organizations = [],
    filters: pageFilters = {},
  } = usePage().props as any;
  const permissions = auth?.permissions || [];

  // State
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedBusiness, setSelectedBusiness] = useState(pageFilters.business || 'all');
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [selectedCircle, setSelectedCircle] = useState(pageFilters.circle || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');

  const hasActiveFilters = () =>
    selectedBusiness !== 'all' || selectedStatus !== 'all' || selectedCircle !== 'all' || searchTerm !== '';

  const activeFilterCount = () =>
    (selectedBusiness !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (selectedCircle !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0);

  // Single source of truth for building the query and navigating. `overrides`
  // lets a control apply its own value immediately without waiting on state.
  const navigate = (overrides: Record<string, any> = {}) => {
    const state = {
      search: searchTerm,
      business: selectedBusiness,
      status: selectedStatus,
      circle: selectedCircle,
      per_page: pageFilters.per_page,
      sort_field: pageFilters.sort_field,
      sort_direction: pageFilters.sort_direction,
      ...overrides,
    };

    const params: any = { page: 1 };
    if (state.search) params.search = state.search;
    if (state.business && state.business !== 'all') params.business = state.business;
    if (state.status && state.status !== 'all') params.status = state.status;
    if (state.circle && state.circle !== 'all') params.circle = state.circle;
    if (state.per_page) params.per_page = state.per_page;
    if (state.sort_field) params.sort_field = state.sort_field;
    if (state.sort_direction) params.sort_direction = state.sort_direction;

    router.get(route('contacts.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate();
  };

  const handleBusinessFilter = (value: string) => {
    setSelectedBusiness(value);
    navigate({ business: value });
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    navigate({ status: value });
  };

  const handleCircleFilter = (value: string) => {
    setSelectedCircle(value);
    navigate({ circle: value });
  };

  const handleSort = (field: string) => {
    const direction =
      pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';
    navigate({ sort_field: field, sort_direction: direction });
  };

  const handleResetFilters = () => {
    setSelectedBusiness('all');
    setSelectedStatus('all');
    setSelectedCircle('all');
    setSearchTerm('');
    setShowFilters(false);
    router.get(
      route('contacts.index'),
      { page: 1, per_page: pageFilters.per_page },
      { preserveState: true, preserveScroll: true },
    );
  };

  const handleAction = (action: string, item: any) => {
    setCurrentItem(item);
    switch (action) {
      case 'view':
        setIsViewModalOpen(true);
        break;
      case 'edit':
        setFormMode('edit');
        setIsFormModalOpen(true);
        break;
      case 'reply':
        if (!item.email) {
          toast.error(t('Contact has no email address'));
          return;
        }
        setIsReplyModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleAddNew = () => {
    setCurrentItem(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (formMode === 'create') {
      toast.loading(t('Creating contact...'));
      router.post(route('contacts.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Contact created successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`${t('Failed to create contact')}: ${Object.values(errors).join(', ')}`);
        },
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating contact...'));
      router.put(route('contacts.update', currentItem.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Contact updated successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`${t('Failed to update contact')}: ${Object.values(errors).join(', ')}`);
        },
      });
    }
  };

  const handleReplySubmit = (replyData: any) => {
    toast.loading(t('Sending reply...'));
    router.post(route('contacts.reply', currentItem.id), replyData, {
      onSuccess: () => {
        setIsReplyModalOpen(false);
        setCurrentItem(null);
        toast.dismiss();
        toast.success(t('Reply sent successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`${t('Failed to send reply')}: ${Object.values(errors).join(', ')}`);
      },
    });
  };

  const handleReplyModalClose = () => {
    setIsReplyModalOpen(false);
    setCurrentItem(null);
  };

  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting contact...'));
    router.delete(route('contacts.destroy', currentItem.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        toast.success(t('Contact deleted successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`${t('Failed to delete contact')}: ${Object.values(errors).join(', ')}`);
      },
    });
  };

  const pageActions = [
    {
      label: t('Create Contact'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => handleAddNew(),
    },
  ];

  const breadcrumbs = [{ title: t('Dashboard'), href: route('dashboard') }, { title: t('Contacts') }];

  const isSuperAdmin = auth?.user?.role === 'super_admin';

  // Normalise the related data into the plain shapes the form fields expect
  // (company -> name string, circles -> array of names).
  const formInitialData = currentItem
    ? {
        ...currentItem,
        organization:
          currentItem.organization?.name ??
          (typeof currentItem.organization === 'string' ? currentItem.organization : ''),
        circles: Array.isArray(currentItem.circles)
          ? currentItem.circles.map((c: any) => (typeof c === 'string' ? c : c.name))
          : [],
        emails: Array.isArray(currentItem.emails) ? currentItem.emails : [],
        phones: Array.isArray(currentItem.phones) ? currentItem.phones : [],
      }
    : currentItem;

  const columns = [
    ...(!isSuperAdmin
      ? [
          {
            key: 'business.name',
            label: t('Business Name'),
            sortable: false,
            render: (_value: any, row: any) => row.business?.name || 'N/A',
          },
        ]
      : []),
    { key: 'name', label: t('Name'), sortable: true },
    { key: 'email', label: t('Email'), sortable: true, render: (value: string) => value || 'N/A' },
    ...(!isSuperAdmin
      ? [
          {
            key: 'organization',
            label: t('Company'),
            sortable: false,
            render: (_value: any, row: any) => row.organization?.name || '—',
          },
          {
            key: 'circles',
            label: t('Circles'),
            sortable: false,
            render: (_value: any, row: any) => {
              const list = Array.isArray(row.circles) ? row.circles : [];
              if (list.length === 0) return '—';
              return (
                <div className="flex flex-wrap gap-1">
                  {list.map((c: any) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: (c.color || '#64748b') + '22',
                        color: c.color || '#475569',
                      }}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: c.color || '#64748b' }}
                      />
                      {c.name}
                    </span>
                  ))}
                </div>
              );
            },
          },
        ]
      : []),
    {
      key: 'status',
      label: t('Status'),
      sortable: true,
      render: (value: string) => {
        const statusColors = {
          new: 'bg-blue-100 text-blue-800',
          contacted: 'bg-yellow-100 text-yellow-800',
          qualified: 'bg-purple-100 text-purple-800',
          converted: 'bg-green-100 text-green-800',
          closed: 'bg-gray-100 text-gray-800',
        };
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
  ];

  const actions = [
    { label: t('View'), icon: 'Eye', action: 'view', className: 'text-green-500', permission: 'view-contacts' },
    { label: t('Edit'), icon: 'Pencil', action: 'edit', className: 'text-amber-500', permission: 'edit-contacts' },
    { label: t('Reply'), icon: 'MessageSquare', action: 'reply', className: 'text-blue-500' },
    { label: t('Delete'), icon: 'Trash2', action: 'delete', className: 'text-red-500' },
  ];

  // Circle multi-select + company combobox field renderers (inline create).
  const circleOptionsFor = (bizId: string) =>
    (circles || [])
      .filter((c: any) => !bizId || String(c.business_id) === String(bizId))
      .map((c: any) => ({ value: c.name, label: c.name, color: c.color }));

  const orgOptionsFor = (bizId: string) =>
    (organizations || []).filter((o: any) => !bizId || String(o.business_id) === String(bizId));

  const relationFields = !isSuperAdmin
    ? [
        {
          name: 'emails',
          label: t('Additional emails'),
          type: 'custom',
          render: (_field: any, formData: any, handleChange: any) => (
            <RepeatableList
              values={formData.emails}
              onChange={(vals) => handleChange('emails', vals)}
              placeholder={t('name@example.com')}
              inputType="email"
              addLabel={t('Add email')}
            />
          ),
        },
        {
          name: 'phones',
          label: t('Additional phones'),
          type: 'custom',
          render: (_field: any, formData: any, handleChange: any) => (
            <RepeatableList
              values={formData.phones}
              onChange={(vals) => handleChange('phones', vals)}
              addLabel={t('Add phone')}
              renderInput={(val, onValueChange) => (
                <PhoneInput value={val} onChange={onValueChange} placeholder={t('5551234567')} />
              )}
            />
          ),
        },
        { name: 'job_title', label: t('Job title'), type: 'text', placeholder: t('e.g. Marketing Director'), width: '48%' },
        { name: 'website', label: t('Website'), type: 'text', placeholder: t('https://example.com'), width: '48%' },
        { name: 'address', label: t('Address'), type: 'textarea', placeholder: t('Street, city, country') },
        { name: 'avatar', label: t('Photo / logo'), type: 'media-picker', placeholder: t('Select an image') },
        {
          name: 'organization',
          label: t('Company'),
          type: 'custom',
          render: (_field: any, formData: any, handleChange: any) => {
            const bizId = String(formData.business_id || '');
            const value =
              typeof formData.organization === 'string'
                ? formData.organization
                : formData.organization?.name ?? '';
            // Same component as Circles, constrained to a single company:
            // picking a new one replaces the current selection.
            return (
              <CreatableMultiSelect
                options={orgOptionsFor(bizId).map((o: any) => ({ value: o.name, label: o.name }))}
                selected={value ? [value] : []}
                onChange={(vals) => handleChange('organization', vals.length ? vals[vals.length - 1] : '')}
                placeholder={t('Select or type a company…')}
              />
            );
          },
        },
        {
          name: 'circles',
          label: t('Circles'),
          type: 'custom',
          render: (_field: any, formData: any, handleChange: any) => {
            const bizId = String(formData.business_id || '');
            const selected = Array.isArray(formData.circles)
              ? formData.circles.map((v: any) => (typeof v === 'string' ? v : v.name))
              : [];
            return (
              <CreatableMultiSelect
                options={circleOptionsFor(bizId)}
                selected={selected}
                onChange={(vals) => handleChange('circles', vals)}
                placeholder={t('Select or type a circle…')}
              />
            );
          },
        },
      ]
    : [];

  return (
    <PageTemplate title={t('Contacts')} url="/contacts" actions={pageActions} breadcrumbs={breadcrumbs} noPadding>
      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          filters={[
            {
              name: 'business',
              label: t('Business'),
              type: 'select',
              value: selectedBusiness,
              onChange: handleBusinessFilter,
              options: [
                { value: 'all', label: t('All Businesses') },
                ...(businesses || []).map((business: any) => ({
                  value: business.id.toString(),
                  label: business.name,
                })),
              ],
            },
            {
              name: 'circle',
              label: t('Circle'),
              type: 'select',
              value: selectedCircle,
              onChange: handleCircleFilter,
              options: [
                { value: 'all', label: t('All Circles') },
                ...(circles || []).map((circle: any) => ({
                  value: circle.id.toString(),
                  label: circle.name,
                })),
              ],
            },
            {
              name: 'status',
              label: t('Status'),
              type: 'select',
              value: selectedStatus,
              onChange: handleStatusFilter,
              options: [
                { value: 'all', label: t('All Statuses') },
                { value: 'new', label: t('New') },
                { value: 'contacted', label: t('Contacted') },
                { value: 'qualified', label: t('Qualified') },
                { value: 'converted', label: t('Converted') },
                { value: 'closed', label: t('Closed') },
              ],
            },
          ]}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
          onApplyFilters={() => navigate()}
          currentPerPage={pageFilters.per_page?.toString() || '10'}
          onPerPageChange={(value) => navigate({ per_page: parseInt(value) })}
        />
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={contacts?.data || []}
          from={contacts?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
          permissions={permissions}
          entityPermissions={{
            view: 'view-contacts',
            edit: 'edit-contacts',
            delete: 'delete-contacts',
          }}
        />

        <Pagination
          from={contacts?.from || 0}
          to={contacts?.to || 0}
          total={contacts?.total || 0}
          links={contacts?.links}
          entityName={t('contacts')}
          onPageChange={(url) => router.get(url)}
        />
      </div>

      {/* Form Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formConfig={{
          fields: [
            ...(!isSuperAdmin
              ? [
                  {
                    name: 'business_id',
                    label: t('Business'),
                    type: 'select',
                    required: true,
                    options: businesses
                      ? businesses.map((business: any) => ({
                          value: business.id.toString(),
                          label: business.name,
                        }))
                      : [],
                  },
                ]
              : []),
            { name: 'name', label: t('Name'), type: 'text', placeholder: t('Enter contact name'), required: true },
            { name: 'email', label: t('Email'), type: 'email', placeholder: t('Enter email address') },
            ...(!isSuperAdmin
              ? [
                  {
                    name: 'phone',
                    label: t('Phone'),
                    type: 'custom',
                    render: (_field: any, formData: any, handleChange: any) => (
                      <PhoneInput
                        value={formData.phone}
                        onChange={(v) => handleChange('phone', v)}
                        placeholder={t('5551234567')}
                      />
                    ),
                  },
                ]
              : []),
            ...relationFields,
            { name: 'message', label: t('Message'), type: 'textarea', placeholder: t('Enter message') },
            {
              name: 'status',
              label: t('Status'),
              type: 'select',
              required: true,
              options: [
                { value: 'new', label: t('New') },
                { value: 'contacted', label: t('Contacted') },
                { value: 'qualified', label: t('Qualified') },
                { value: 'converted', label: t('Converted') },
                { value: 'closed', label: t('Closed') },
              ],
            },
            ...(!isSuperAdmin
              ? [{ name: 'notes', label: t('Notes'), type: 'textarea', placeholder: t('Enter notes') }]
              : []),
          ],
          modalSize: '2xl',
        }}
        initialData={formInitialData}
        title={formMode === 'create' ? t('Create Contact') : formMode === 'edit' ? t('Edit Contact') : t('View Contact')}
        mode={formMode}
      />

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        {currentItem && <View contact={currentItem} />}
      </Dialog>

      {/* Reply Modal */}
      <ContactReplyModal
        isOpen={isReplyModalOpen}
        onClose={handleReplyModalClose}
        onSubmit={handleReplySubmit}
        contact={currentItem}
      />

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName="contact"
      />
    </PageTemplate>
  );
}
