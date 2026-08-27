import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ArrowUp, ArrowDown, ImageOff } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface GalleryItem {
  id: number;
  image: string;
  image_url: string | null;
  sort_order: number;
  is_enabled: boolean;
}

/**
 * Admin "Card Gallery" — image-only entries (each image IS the whole design).
 * Add via the media picker, toggle visibility, reorder, delete. Mirrors the
 * NFC-cards admin shell (PageTemplate + CrudFormModal + CrudDeleteModal).
 */
export default function GalleryManager() {
  const { t } = useTranslation();
  const { items = [] } = usePage().props as unknown as { items: GalleryItem[] };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [current, setCurrent] = useState<GalleryItem | null>(null);

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Gallery') },
  ];

  const pageActions = [
    {
      label: t('Add Image'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => { setCurrent(null); setIsFormOpen(true); },
    },
  ];

  const handleAdd = (formData: any) => {
    if (!formData.image) {
      toast.error(t('Please select an image'));
      return;
    }
    toast.loading(t('Adding image...'));
    router.post(route('gallery-manager.store'), { image: formData.image, is_enabled: true }, {
      preserveScroll: true,
      onSuccess: (page: any) => {
        setIsFormOpen(false);
        toast.dismiss();
        if (page.props?.flash?.success) toast.success(page.props.flash.success);
      },
      onError: (errors) => { toast.dismiss(); toast.error(Object.values(errors).join(', ')); },
    });
  };

  const toggle = (item: GalleryItem) => {
    router.put(route('gallery-manager.update', item.id), { is_enabled: !item.is_enabled }, {
      preserveScroll: true,
      onError: (errors) => toast.error(Object.values(errors).join(', ')),
    });
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const order = items.map((it) => it.id);
    [order[index], order[target]] = [order[target], order[index]];
    router.post(route('gallery-manager.reorder'), { order }, {
      preserveScroll: true,
      onError: (errors) => toast.error(Object.values(errors).join(', ')),
    });
  };

  const handleDelete = () => {
    if (!current) return;
    toast.loading(t('Deleting image...'));
    router.delete(route('gallery-manager.destroy', current.id), {
      preserveScroll: true,
      onSuccess: (page: any) => {
        setIsDeleteOpen(false);
        toast.dismiss();
        if (page.props?.flash?.success) toast.success(page.props.flash.success);
      },
      onError: (errors) => { toast.dismiss(); toast.error(Object.values(errors).join(', ')); },
    });
  };

  return (
    <PageTemplate title={t('Gallery')} url="/gallery-manager" actions={pageActions} breadcrumbs={breadcrumbs}>
      <p className="text-sm text-muted-foreground mb-4">
        {t('Each image is a full card design shown on the homepage gallery and the public /gallery page. Upload the finished artwork — no other fields needed.')}
      </p>

      {items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <ImageOff className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">{t('No gallery images yet.')}</p>
          <Button onClick={() => { setCurrent(null); setIsFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />{t('Add Image')}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-[3/4] w-full bg-muted">
                {item.image_url ? (
                  <img
                    src={getImageDisplayUrl(item.image_url)}
                    alt=""
                    className={`h-full w-full object-cover transition-opacity ${item.is_enabled ? '' : 'opacity-40'}`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageOff className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="flex items-center gap-2">
                  <Switch checked={item.is_enabled} onCheckedChange={() => toggle(item)} />
                  <span className="text-xs text-muted-foreground">{item.is_enabled ? t('Visible') : t('Hidden')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={index === 0} onClick={() => move(index, -1)} aria-label={t('Move up')}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label={t('Move down')}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setCurrent(item); setIsDeleteOpen(true); }} aria-label={t('Delete')}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CrudFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAdd}
        title={t('Add Gallery Image')}
        mode="create"
        formConfig={{
          fields: [
            { name: 'image', label: t('Design Image'), type: 'media-picker', required: true, placeholder: t('Select the card design image...') },
          ],
          modalSize: 'lg',
        }}
        initialData={{}}
      />

      <CrudDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={t('this image')}
        entityName="gallery image"
      />
    </PageTemplate>
  );
}
