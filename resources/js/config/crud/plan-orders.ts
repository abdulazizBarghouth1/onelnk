import { CrudConfig } from '@/types/crud';

export const planOrdersConfig: CrudConfig = {
  entity: {
    name: 'plan-orders',
    endpoint: route('plan-orders.index'),
    permissions: {
      view: 'view-plan-orders',
      create: 'create-plan-orders',
      edit: 'edit-plan-orders',
      delete: 'delete-plan-orders'
    }
  },
  filters: [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ]
    }
  ],
  table: { columns: [], actions: [] },
  form: { fields: [] }
};