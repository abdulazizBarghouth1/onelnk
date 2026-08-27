import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import { Hash, User, Package, Calendar, Landmark, Tag, Banknote, Clock, StickyNote } from 'lucide-react';

interface ViewPlanOrderProps {
  planOrder: any;
}

export default function PlanOrderView({ planOrder }: ViewPlanOrderProps) {
  const { t } = useTranslation();

  const statusColors: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const formatDate = (value: string | null) => {
    if (!value) return '-';
    return window.appSettings?.formatDateTime(value, false) || new Date(value).toLocaleDateString();
  };

  const Field = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <div className="text-base">{children}</div>
      </div>
    </div>
  );

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>{t('Plan Order Details')}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">

        <div className="grid grid-cols-2 gap-4">
          <Field icon={<Hash className="h-4 w-4" />} label={t('Order Number')}>
            <p className="font-semibold">{planOrder.order_number}</p>
          </Field>
          <Field icon={<Clock className="h-4 w-4" />} label={t('Status')}>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[planOrder.status] || 'bg-gray-100 text-gray-800'}`}>
              {t(planOrder.status)}
            </span>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field icon={<User className="h-4 w-4" />} label={t('User')}>
            <p>{planOrder.user?.name || '-'}</p>
          </Field>
          <Field icon={<Package className="h-4 w-4" />} label={t('Plan')}>
            {planOrder.plan?.name ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                {planOrder.plan.name}
              </span>
            ) : <p>-</p>}
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field icon={<Calendar className="h-4 w-4" />} label={t('Billing Cycle')}>
            <p>{planOrder.billing_cycle ? t(planOrder.billing_cycle) : '-'}</p>
          </Field>
          <Field icon={<Landmark className="h-4 w-4" />} label={t('Payment Method')}>
            <p>{planOrder.payment_method ? t(planOrder.payment_method) : '-'}</p>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field icon={<Calendar className="h-4 w-4" />} label={t('Order Date')}>
            <p>{formatDate(planOrder.ordered_at)}</p>
          </Field>
          <Field icon={<Calendar className="h-4 w-4" />} label={t('Processed Date')}>
            <p>{formatDate(planOrder.processed_at)}</p>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field icon={<Tag className="h-4 w-4" />} label={t('Original Price')}>
            <p>{window.appSettings.formatCurrency(planOrder.original_price || 0)}</p>
          </Field>
          <Field icon={<Banknote className="h-4 w-4" />} label={t('Final Price')}>
            <p className="font-semibold">{window.appSettings.formatCurrency(planOrder.final_price || 0)}</p>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field icon={<Tag className="h-4 w-4" />} label={t('Discount')}>
            <p>{planOrder.discount_amount > 0 ? `-${window.appSettings.formatCurrency(planOrder.discount_amount)}` : '-'}</p>
          </Field>
          <Field icon={<User className="h-4 w-4" />} label={t('Processed By')}>
            <p>{planOrder.processed_by?.name || '-'}</p>
          </Field>
        </div>

        {planOrder.coupon_code && (
          <Field icon={<Tag className="h-4 w-4" />} label={t('Coupon Code')}>
            <p>{planOrder.coupon_code}</p>
          </Field>
        )}

        {planOrder.notes && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('Notes')}</h4>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed break-words">{planOrder.notes}</p>
              </div>
            </div>
          </>
        )}

      </div>
    </DialogContent>
  );
}
