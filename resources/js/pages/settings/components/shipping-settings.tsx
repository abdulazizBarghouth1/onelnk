import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Save, Truck } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

interface ShippingSettingsProps {
  settings?: Record<string, string>;
}

export default function ShippingSettings({ settings = {} }: ShippingSettingsProps) {
  const { t } = useTranslation();
  const pageProps = usePage().props as any;

  const settingsData = Object.keys(settings).length > 0 ? settings : (pageProps.settings || {});

  const [form, setForm] = useState({
    shipping_fee: settingsData.shipping_fee ?? '0',
    free_shipping_threshold: settingsData.free_shipping_threshold ?? '0',
  });

  useEffect(() => {
    if (Object.keys(settingsData).length > 0) {
      setForm({
        shipping_fee: settingsData.shipping_fee ?? '0',
        free_shipping_threshold: settingsData.free_shipping_threshold ?? '0',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageProps.settings]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(route('settings.shipping.update'), form, {
      preserveScroll: true,
      onSuccess: (page) => {
        const success = (page.props as any).flash?.success;
        const error = (page.props as any).flash?.error;
        if (success) toast.success(success);
        else if (error) toast.error(error);
      },
      onError: (errors) => toast.error(Object.values(errors).join(', ') || t('Failed to update shipping settings')),
    });
  };

  return (
    <SettingsSection
      title={t('Shipping Settings')}
      description={t('Configure the flat shipping fee and the order total above which shipping becomes free for NFC card orders.')}
      action={
        <Button type="submit" form="shipping-settings-form" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {t('Save Changes')}
        </Button>
      }
    >
      <form id="shipping-settings-form" onSubmit={submit} className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="shipping_fee">{t('Shipping Fee')}</Label>
          <Input
            id="shipping_fee"
            type="number"
            min="0"
            step="0.01"
            value={form.shipping_fee}
            onChange={(e) => setForm((p) => ({ ...p, shipping_fee: e.target.value }))}
            placeholder="0.00"
          />
          <p className="text-xs text-muted-foreground">{t('Flat fee applied to each order. Set to 0 for always-free shipping.')}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="free_shipping_threshold">{t('Free Shipping Threshold')}</Label>
          <Input
            id="free_shipping_threshold"
            type="number"
            min="0"
            step="0.01"
            value={form.free_shipping_threshold}
            onChange={(e) => setForm((p) => ({ ...p, free_shipping_threshold: e.target.value }))}
            placeholder="0.00"
          />
          <p className="text-xs text-muted-foreground">
            {t('Orders with a subtotal at or above this amount ship free. Set to 0 to disable the threshold.')}
          </p>
        </div>

        <div className="rounded-md border bg-blue-50 dark:bg-blue-950/30 p-3 flex items-start gap-2">
          <Truck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {t('Example: a $10 fee with a $75 threshold means orders under $75 pay $10 shipping, and orders of $75+ ship free.')}
          </p>
        </div>
      </form>
    </SettingsSection>
  );
}
