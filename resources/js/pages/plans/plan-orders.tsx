import { PageTemplate } from '@/components/page-template';
import { CrudTable } from '@/components/CrudTable';
import { planOrdersConfig } from '@/config/crud/plan-orders';
import { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import PlanOrderView from './plan-order-view';

export default function PlanOrdersPage() {
  const { t } = useTranslation();
  const { flash, planOrders, filters: pageFilters = {}, auth, isSuperAdmin = false } = usePage().props as any;
  const permissions = auth?.permissions || [];
  
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [rejectItem, setRejectItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  useEffect(() => {
    const initialFilters: Record<string, any> = {};
    planOrdersConfig.filters?.forEach(filter => {
      initialFilters[filter.key] = pageFilters[filter.key] || '';
    });
    setFilterValues(initialFilters);
  }, []);

  const handleAction = (action: string, item: any) => {
    if (action === 'view') {
      setViewingItem(item);
    } else if (action === 'approve') {
      router.post(route("plan-orders.approve", item.id), {}, {
        onSuccess: () => {
          // toast.success(t('Plan order approved successfully'));
        },
        onError: () => {
          toast.error(t('Failed to approve plan order'));
        }
      });
    } else if (action === 'reject') {
      setRejectItem(item);
      setRejectNotes('');
      setRejectModalOpen(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params[key] = value;
      }
    });
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route("plan-orders.index"), params, { preserveState: true, preserveScroll: true });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    const newFilters = { ...filterValues, [key]: value };
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') {
        params[k] = v;
      }
    });
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route("plan-orders.index"), params, { preserveState: true, preserveScroll: true });
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Plans'), href: route('plans.index') },
    { title: isSuperAdmin ? t('Plan Orders') : t('My Plan Orders') }
  ];

  const hasActiveFilters = () => {
    return Object.entries(filterValues).some(([key, value]) => {
      return value && value !== '';
    }) || searchTerm !== '';
  };

  const handleRejectConfirm = () => {
    router.post(route('plan-orders.reject', rejectItem.id), { notes: rejectNotes }, {
      onSuccess: () => {
        setRejectModalOpen(false);
        setRejectItem(null);
        setRejectNotes('');
      },
      onError: () => {
        toast.error(t('Failed to reject plan order'));
      }
    });
  };

  const columns = [
    {
      key: 'order_number',
      label: t('Order Number'),
      render: (value: string) => value || '-'
    },
    
    ...(isSuperAdmin ? [{
      key: 'user.name',
      label: t('User Name'),
      render: (_: any, row: any) => (
        <div>
          <div className="font-medium">{row.user?.name || '-'}</div>
          <div className="text-xs text-gray-500">{row.user?.email || ''}</div>
        </div>
      )
    }] : []),
    {
      key: 'plan.name',
      label: t('Plan Name'),
      render: (_: any, row: any) => {
        const name = row.plan?.name;
        if (!name) return '-';
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
            {name}
          </span>
        );
      }
    },
    {
      key: 'original_price',
      label: t('Original Price'),
      render: (value: number) => window.appSettings.formatCurrency(value)
    },
    {
      key: 'coupon_code',
      label: t('Coupon Code'),
      render: (value: string) => value || '-'
    },
    {
      key: 'discount_amount',
      label: t('Discount'),
      render: (value: number) => value > 0 ? `-${window.appSettings.formatCurrency(value)}` : '-'
    },
    {
      key: 'final_price',
      label: t('Final Price'),
      render: (value: number) => window.appSettings.formatCurrency(value)
    },
    {
      key: 'status',
      label: t('Status'),
      render: (value: string) => {
        const statusColors: Record<string, string> = {
          pending:  'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {t(value)}
          </span>
        );
      }
    },
    {
      key: 'receipt',
      label: t('Receipt'),
      render: (value: string) => {
        if (!value) return <span className="text-gray-400">-</span>;
        const receiptPath = value.startsWith('bank-receipts/')
          ? `media/${value}`
          : value;
        const url = getImageDisplayUrl(receiptPath);
        return (
          <button
            type="button"
            onClick={() => window.open(url, '_blank')}
            className="inline-flex items-center justify-center text-primary hover:text-primary/80 transition-colors cursor-pointer"
            title={t('View receipt')}
          >
            <FileText className="h-4 w-4" />
          </button>
        );
      }
    },
    {
      key: 'ordered_at',
      label: t('Order Date'),
      render: (value: string) => window.appSettings.formatDateTime(value, false)
    },
  ];

  const actions = [
    {
      label: t('View'),
      icon: 'Eye',
      action: 'view',
      className: 'text-blue-600',
    },
    {
      label: t('Approve'),
      icon: 'Check',
      action: 'approve',
      className: 'text-green-600',
      condition: (row: any) => row.status === 'pending' && isSuperAdmin
    },
    {
      label: t('Reject'),
      icon: 'X',
      action: 'reject',
      className: 'text-red-600',
      condition: (row: any) => row.status === 'pending' && isSuperAdmin
    }
  ];

  return (
    <PageTemplate 
      title={isSuperAdmin ? t('Plan Orders') : t('My Plan Orders')} 
      url="/plan-orders"
      breadcrumbs={breadcrumbs}
      noPadding
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          filters={planOrdersConfig.filters?.map(filter => ({
            name: filter.key,
            label: t(filter.label),
            type: 'select',
            value: filterValues[filter.key] || '',
            onChange: (value) => handleFilterChange(filter.key, value),
            options: filter.options?.map(option => ({
              value: option.value,
              label: t(option.label)
            })) || []
          })) || []}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={() => {
            return Object.values(filterValues).filter(v => v && v !== '').length + (searchTerm ? 1 : 0);
          }}
          onResetFilters={() => {
            setSearchTerm('');
            setFilterValues({});
            router.get(route('plan-orders.index'), { page: 1 }, { preserveState: true, preserveScroll: true });
          }}
          onApplyFilters={applyFilters}
          currentPerPage={pageFilters.per_page?.toString() || "10"}
          onPerPageChange={(value) => {
            const params: any = { page: 1, per_page: parseInt(value) };
            
            if (searchTerm) {
              params.search = searchTerm;
            }
            
            Object.entries(filterValues).forEach(([key, val]) => {
              if (val && val !== '') {
                params[key] = val;
              }
            });
            
            router.get(route('plan-orders.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={planOrders?.data || []}
          from={planOrders?.from || 1}
          onAction={handleAction}
          permissions={permissions}
          entityPermissions={planOrdersConfig.entity.permissions}
          context={{ isSuperAdmin }}
        />

        <Pagination
          from={planOrders?.from || 0}
          to={planOrders?.to || 0}
          total={planOrders?.total || 0}
          links={planOrders?.links}
          entityName={t("plan orders")}
          onPageChange={(url) => {
            if (url) {
              const urlObj = new URL(url, window.appSettings.baseUrl);
              if (pageFilters.per_page) {
                urlObj.searchParams.set('per_page', pageFilters.per_page.toString());
              }
              router.get(urlObj.toString());
            }
          }}
        />
      </div>

      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        {viewingItem && <PlanOrderView planOrder={viewingItem} />}
      </Dialog>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Reject Plan Order')}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="reject-notes">{t('Rejection reason (optional)')}</Label>
            <Textarea
              id="reject-notes"
              className="mt-2"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder={t('Enter rejection reason...')}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>{t('Cancel')}</Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>{t('Reject')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}