import React from 'react';
import { CrudConfig } from '@/types/crud';
import { columnRenderers } from '@/utils/columnRenderers';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import { t } from '@/utils/i18n';

export const orderRequestsConfig: CrudConfig = {
  entity: {
    name: 'orderRequests',
    endpoint: route('nfc-cards.order-requests'),
    permissions: {
      view: 'view-nfc-card-order-requests',
      create: 'create-nfc-card-order-requests',
      edit: 'edit-nfc-card-order-requests',
      delete: 'delete-nfc-card-order-requests'
    }
  },
  modalSize: '4xl',
  description: t('Manage NFC card order requests from users'),
  table: {
    columns: [
      { key: 'order_number', label: t('Order #'), sortable: true, render: (value) => value || '-' },
      {
        key: 'user.name',
        label: t('User'),
        sortable: true,
        condition: () => window.auth?.user?.type === 'superadmin',
        render: (value, row) => {
          const company = row?.user;
          const avatarUrl = getImageDisplayUrl(company?.avatar_url) || '/storage/images/avatar/avatar.png';

          if (!company) {
            return React.createElement('span', null, '-');
          }

          return React.createElement(
            'div',
            { className: 'flex items-center gap-3' },
            [
              React.createElement(
                'div',
                {
                  key: 'avatar-wrapper',
                  className: 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center shrink-0',
                },
                React.createElement('img', {
                  src: avatarUrl,
                  alt: company.name || value || 'Company',
                  className: 'w-full h-full object-cover',
                  onError: (e: any) => {
                    e.target.src = '/storage/images/avatar/avatar.png';
                  },
                }),
              ),
              React.createElement(
                'div',
                { key: 'content' },
                [
                  React.createElement(
                    'div',
                    { key: 'name', className: 'font-medium' },
                    company.name || value || '-',
                  ),
                ],
              ),
            ],
          );
        },
      },
      { key: 'business.name', label: t('Business Name'), sortable: true },
      { key: 'business_link', label: t('Business Link'), sortable: false, condition: () => window.auth?.user?.type === 'superadmin' },
      { key: 'nfc_card.name', label: t('NFC Card'), sortable: true },
      { key: 'quantity', label: t('Quantity'), sortable: true },
      { 
        key: 'original_price', 
        label: t('Unit Price'), 
        render: (value) => value ? (window.appSettings?.formatCurrency(value) || `$${parseFloat(value).toFixed(2)}`) : '-'
      },
      {
        key: 'total_price',
        label: t('Total Price'),
        render: (value) => value ? (window.appSettings?.formatCurrency(value) || `$${parseFloat(value).toFixed(2)}`) : '-'
      },
      {
        key: 'payment_method',
        label: t('Payment'),
        render: (value, row) => {
          const method = value ? (value === 'cod' ? t('Cash on Delivery') : t('Manual')) : '-';
          const paid = row?.payment_status === 'paid';
          return `${method}${value ? ` (${paid ? t('Paid') : t('Unpaid')})` : ''}`;
        }
      },
      {
        key: 'status',
        label: t('Status'),
        render: columnRenderers.status({
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          processing: 'bg-blue-100 text-blue-800',
          shipped: 'bg-indigo-100 text-indigo-800',
          delivered: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
          cancelled: 'bg-gray-100 text-gray-800',
        })
      },
    ],
    actions: [
      {
        label: t('View'),
        icon: 'Eye',
        action: 'view-details',
        className: 'text-blue-600'
      },
      { 
        label: t('Approve'), 
        icon: 'Check', 
        action: 'approve', 
        className: 'text-green-600',
        condition: (item: any) => item.status === 'pending' && window.auth?.user?.type === 'superadmin'
      },
      {
        label: t('Reject'),
        icon: 'X',
        action: 'reject',
        className: 'text-red-600',
        condition: (item: any) => item.status === 'pending' && window.auth?.user?.type === 'superadmin'
      },
      {
        label: t('Mark Processing'),
        icon: 'Loader',
        action: 'status:processing',
        className: 'text-blue-600',
        condition: (item: any) => item.status === 'approved' && window.auth?.user?.type === 'superadmin'
      },
      {
        label: t('Mark Shipped'),
        icon: 'Truck',
        action: 'status:shipped',
        className: 'text-indigo-600',
        condition: (item: any) => item.status === 'processing' && window.auth?.user?.type === 'superadmin'
      },
      {
        label: t('Mark Delivered'),
        icon: 'PackageCheck',
        action: 'status:delivered',
        className: 'text-green-600',
        condition: (item: any) => item.status === 'shipped' && window.auth?.user?.type === 'superadmin'
      },
      {
        label: t('Cancel Order'),
        icon: 'Ban',
        action: 'status:cancelled',
        className: 'text-red-600',
        condition: (item: any) => ['approved', 'processing', 'shipped'].includes(item.status) && window.auth?.user?.type === 'superadmin'
      },
      {
        label: t('Delete'),
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500',
        condition: (item: any) => item.status === 'pending'
      }
    ]
  },
  search: {
    enabled: true,
    placeholder: t('Search order requests...'),
    fields: ['user.name', 'business.name', 'nfc_card.name']
  },
  filters: [
    {
      key: 'status',
      label: t('Status'),
      type: 'select',
      options: [
        { value: 'all', label: t('All Status') },
        { value: 'pending', label: t('Pending') },
        { value: 'approved', label: t('Approved') },
        { value: 'processing', label: t('Processing') },
        { value: 'shipped', label: t('Shipped') },
        { value: 'delivered', label: t('Delivered') },
        { value: 'rejected', label: t('Rejected') },
        { value: 'cancelled', label: t('Cancelled') }
      ]
    }
  ],
  form: {
    fields: []
  }
};
