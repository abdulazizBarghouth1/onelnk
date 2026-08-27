import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User, Building2, CreditCard, Package, MapPin, Clock, Download, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import { usePage } from '@inertiajs/react';

interface ViewProps {
  orderRequest: any;
}

function Field({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value ?? '-'}</p>
      </div>
    </div>
  );
}

export default function View({ orderRequest }: ViewProps) {
  const { t } = useTranslation();
  const { auth } = usePage().props as any;
  const isSuperAdmin = auth?.user?.type === 'superadmin';

  const formatCurrency = (value: any) =>
    (window as any).appSettings?.formatCurrency(value) ?? `$${parseFloat(value).toFixed(2)}`;

  const formatDate = (value: any) =>
    (window as any).appSettings?.formatDateTime(value, false) ?? value;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const logoUrl = orderRequest?.logo ? getImageDisplayUrl(orderRequest.logo) : null;

  const handleDownloadLogo = () => {
    if (!logoUrl) return;
    const a = document.createElement('a');
    a.href = logoUrl;
    a.download = `logo-order-${orderRequest.id}`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
      <DialogHeader className="flex-shrink-0">
        <DialogTitle>{t('Order Request Details')}</DialogTitle>
      </DialogHeader>

      <div className="overflow-y-auto flex-1 space-y-4 pr-1">
        {/* Summary bar */}
        <div className="bg-primary/5 rounded-lg px-4 py-3 border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShoppingCart className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{orderRequest.order_number ? t('Order :n', { n: orderRequest.order_number }) : t('NFC Card')}</p>
              <p className="text-sm font-semibold break-words">{orderRequest.nfc_card?.name ?? '-'}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(orderRequest.status)} rounded-full flex-shrink-0 border`}>
            {orderRequest.status?.charAt(0).toUpperCase() + orderRequest.status?.slice(1)}
          </Badge>
        </div>

        {/* Order + Company in 2-col grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Field icon={Package} label={t('Quantity')} value={orderRequest.quantity} />
          <Field icon={Clock} label={t('Requested At')} value={formatDate(orderRequest.created_at)} />
          <Field icon={CreditCard} label={t('Unit Price')} value={orderRequest.original_price ? formatCurrency(orderRequest.original_price) : '-'} />
          <Field icon={CreditCard} label={t('Total Price')} value={orderRequest.total_price ? formatCurrency(orderRequest.total_price) : '-'} />
          {orderRequest.user && (
            <Field icon={User} label={t('User')} value={orderRequest.user?.name} />
          )}
          <Field icon={Building2} label={t('Business')} value={orderRequest.business?.name} />
          {orderRequest.plan && (
            <Field icon={Package} label={t('Digital Plan')} value={orderRequest.plan?.name} />
          )}
          {orderRequest.payment_method && (
            <Field
              icon={CreditCard}
              label={t('Payment')}
              value={`${orderRequest.payment_method === 'cod' ? t('Cash on Delivery') : t('Manual')} · ${orderRequest.payment_status === 'paid' ? t('Paid') : t('Unpaid')}`}
            />
          )}
        </div>

        {/* Card design */}
        {(orderRequest.card_color || orderRequest.text_color) && (
          <>
            <Separator />
            <div className="flex items-center gap-6">
              {orderRequest.card_color && (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-md border" style={{ background: orderRequest.card_color }} />
                  <span className="text-xs text-muted-foreground">{t('Card Color')}</span>
                </div>
              )}
              {orderRequest.text_color && (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-md border" style={{ background: orderRequest.text_color }} />
                  <span className="text-xs text-muted-foreground">{t('Text Color')}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Printed card design (what staff produce the physical card from) */}
        {(orderRequest as any).card_design && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">{t('Printed Card Design')}</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {(orderRequest as any).card_design.full_name && <Field icon={User} label={t('Name')} value={(orderRequest as any).card_design.full_name} />}
                {(orderRequest as any).card_design.job_title && <Field icon={User} label={t('Job Title')} value={(orderRequest as any).card_design.job_title} />}
                {(orderRequest as any).card_design.phone && <Field icon={User} label={t('Phone')} value={(orderRequest as any).card_design.phone} />}
                {(orderRequest as any).card_design.email && <Field icon={User} label={t('Email')} value={(orderRequest as any).card_design.email} />}
                {(orderRequest as any).card_design.website && <Field icon={User} label={t('Website')} value={(orderRequest as any).card_design.website} />}
              </div>
              {(orderRequest as any).card_design.colors?.background && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-block w-10 h-6 rounded-md border" style={{ background: (orderRequest as any).card_design.colors.background }} />
                  <span className="text-xs text-muted-foreground">{(orderRequest as any).card_design.colors.type === 'gradient' ? t('Gradient background') : t('Card background')}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Delivery details */}
        {(orderRequest.recipient_name || orderRequest.recipient_phone || orderRequest.city) && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {orderRequest.recipient_name && <Field icon={User} label={t('Recipient')} value={orderRequest.recipient_name} />}
              {orderRequest.recipient_phone && <Field icon={User} label={t('Phone')} value={orderRequest.recipient_phone} />}
              {orderRequest.recipient_email && <Field icon={User} label={t('Email')} value={orderRequest.recipient_email} />}
              {orderRequest.city && <Field icon={MapPin} label={t('City')} value={orderRequest.city} />}
            </div>
          </>
        )}

        {/* Delivery notes */}
        {orderRequest.delivery_notes && (
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-1">{t('Order Notes')}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed break-words">{orderRequest.delivery_notes}</p>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {orderRequest.shipping_address && (
          <>
            <Separator />
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{t('Shipping Address')}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed break-words">
                  {orderRequest.shipping_address}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Company Logo — superadmin only */}
        {isSuperAdmin && (
          <>
            <Separator />
            {logoUrl && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{t('Company Logo')}</p>
                  <Button variant="outline" size="sm" onClick={handleDownloadLogo} className="h-7 text-xs gap-1.5">
                    <Download className="h-3 w-3" />
                    {t('Download')}
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="w-14 h-14 rounded-md border border-gray-200 dark:border-gray-600 overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{orderRequest.business?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('Uploaded by company for NFC card design')}</p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DialogContent>
  );
}
