import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Type, Palette, Image, Plus, Trash2, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Repeater } from '@/components/ui/repeater';
import MediaPicker from '@/components/MediaPicker';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { getImageDisplayUrl, convertUrlToRelativePath } from '@/utils/imageUrlHelper';

export default function FeaturesSection({ data, setData, errors, handleInputChange, getSectionData, updateSectionData, updateSectionVisibility, t = (key) => key }) {
  const { themeColor, customColor } = useBrand();
  const brandColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
  

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Type className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t("Features Content")}</h3>
              <p className="text-sm text-gray-500">{t("Features section title and description")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t("Enable Section")}</Label>
            <Switch
              checked={data.config_sections?.section_visibility?.features !== false}
              onCheckedChange={(checked) => updateSectionVisibility('features', checked)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label htmlFor="features_title">{t("Features Title")}</Label>
            <Input
              id="features_title"
              name="features_title"
              value={getSectionData('features').title || ''}
              onChange={(e) => updateSectionData('features', { title: e.target.value })}
              placeholder="Features section title"
            />
            {errors.features_title && (
              <p className="text-red-600 text-sm">{errors.features_title}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="features_description">{t("Features Subtitle")}</Label>
            <Textarea
              id="features_description"
              name="features_description"
              value={getSectionData('features').description || ''}
              onChange={(e) => updateSectionData('features', { description: e.target.value })}
              placeholder={t("Description text for features section")}
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <Label htmlFor="features_show_icons">{t("Show Icons")}</Label>
                <p className="text-xs text-muted-foreground">
                  {t("Display icons with features")}
                </p>
              </div>
              <Switch
                id="features_show_icons"
                name="features_show_icons"
                checked={getSectionData('features').show_icons !== false}
                onCheckedChange={(checked) => updateSectionData('features', { show_icons: checked })}
              />
            </div>
          </div>

        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Palette className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t("Features Style")}</h3>
            <p className="text-sm text-gray-500">{t("Background, font colors and section image")}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="features_background_color">{t("Background Color")}</Label>
            <div className="flex gap-2">
              <Input
                id="features_background_color"
                name="features_background_color"
                type="color"
                value={getSectionData('features').background_color || '#ffffff'}
                onChange={(e) => updateSectionData('features', { background_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={getSectionData('features').background_color || '#ffffff'}
                onChange={(e) => updateSectionData('features', { background_color: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="features_text_color">{t("Font Color")}</Label>
            <div className="flex gap-2">
              <Input
                id="features_text_color"
                name="features_text_color"
                type="color"
                value={getSectionData('features').text_color || '#0f172a'}
                onChange={(e) => updateSectionData('features', { text_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={getSectionData('features').text_color || '#0f172a'}
                onChange={(e) => updateSectionData('features', { text_color: e.target.value })}
                placeholder="#0f172a"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <MediaPicker
              label="Section Image"
              value={getImageDisplayUrl(getSectionData('features').image || '')}
              onChange={(value) => {
                updateSectionData('features', { image: convertUrlToRelativePath(value) });
              }}
              placeholder={t("Select features section image...")}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Star className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t("Feature Boxes")}</h3>
            <p className="text-sm text-gray-500">{t("Individual feature items with icons")}</p>
          </div>
        </div>
        <Repeater
          fields={[
            {
              name: 'title',
              label: t('Title'),
              type: 'text',
              placeholder: t('Feature title'),
              required: true,
            },
            {
              name: 'icon',
              label: t('Icon'),
              type: 'select',
              placeholder: t('Select icon'),
              required: true,
              options: [
                { value: 'qr-code', label: 'QR Code' },
                { value: 'smartphone', label: 'Smartphone' },
                { value: 'share', label: 'Share' },
                { value: 'bar-chart', label: 'Bar Chart' },
                { value: 'globe', label: 'Globe' },
                { value: 'shield', label: 'Shield' },
                { value: 'shield-check', label: 'Shield Check' },
                { value: 'star', label: 'Star' },
                { value: 'zap', label: 'Zap' },
                { value: 'users', label: 'Users' },
                { value: 'lock', label: 'Lock' },
                { value: 'wifi', label: 'Wifi' },
                { value: 'heart', label: 'Heart' },
                { value: 'sparkles', label: 'Sparkles' },
              ],
            },
            {
              name: 'icon_color',
              label: t('Icon Color'),
              type: 'color',
              placeholder: '#3b82f6',
              defaultValue: '#3b82f6',
            },
            {
              name: 'description',
              label: t('Description'),
              type: 'textarea',
              placeholder: t('Feature description'),
              required: true,
            },
          ]}
          value={getSectionData('features').features_list || []}
          onChange={(features_list) => updateSectionData('features', { features_list })}
          minItems={0}
          maxItems={-1}
          addButtonText={t('Add Feature Box')}
          removeButtonText=""
          showItemNumbers={true}
          allowReorder={false}
          emptyMessage={t('No feature boxes added yet.')}
        />
      </div>
    </div>
  );
}
