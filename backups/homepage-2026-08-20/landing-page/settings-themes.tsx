import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import MediaPicker from '@/components/MediaPicker';
import { Palette, Paintbrush2 } from 'lucide-react';
import { Repeater } from '@/components/ui/repeater';

interface ThemesSectionProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  getSectionData: (key: string) => any;
  updateSectionData: (key: string, updates: any) => void;
  updateSectionVisibility: (key: string, visible: boolean) => void;
  t: (key: string) => string;
}

export default function ThemesSection({ data, getSectionData, updateSectionData, updateSectionVisibility, t }: ThemesSectionProps) {
  const section = getSectionData('themes');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Palette className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('Themes Colors')}</h3>
              <p className="text-sm text-gray-500">{t('Background and text colors for themes section')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t('Enable Section')}</Label>
            <Switch
              checked={data.config_sections?.section_visibility?.themes !== false}
              onCheckedChange={(checked) => updateSectionVisibility('themes', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="themes_background_color">{t('Background Color')}</Label>
            <div className="flex gap-2">
              <Input
                id="themes_background_color"
                type="color"
                value={section.background_color || '#ffffff'}
                onChange={(e) => updateSectionData('themes', { background_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={section.background_color || '#ffffff'}
                onChange={(e) => updateSectionData('themes', { background_color: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="themes_text_color">{t('Text Color')}</Label>
            <div className="flex gap-2">
              <Input
                id="themes_text_color"
                type="color"
                value={section.text_color || '#111827'}
                onChange={(e) => updateSectionData('themes', { text_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={section.text_color || '#111827'}
                onChange={(e) => updateSectionData('themes', { text_color: e.target.value })}
                placeholder="#111827"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Paintbrush2 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Themes Content')}</h3>
            <p className="text-sm text-gray-500">{t('Title, subtitle and theme message block')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label htmlFor="themes_title">{t('Section Title')}</Label>
            <Input
              id="themes_title"
              value={section.title || ''}
              onChange={(e) => updateSectionData('themes', { title: e.target.value })}
              placeholder={t('Create a Cohesive Visual Theme')}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="themes_subtitle">{t('Section Subtitle')}</Label>
            <Textarea
              id="themes_subtitle"
              value={section.subtitle || ''}
              onChange={(e) => updateSectionData('themes', { subtitle: e.target.value })}
              placeholder={t('Keep your landing page and template previews aligned with a polished visual system.')}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="themes_image">{t('Image')}</Label>
            <MediaPicker
              label=""
              value={section.image || ''}
              onChange={(value) => updateSectionData('themes', { image: value })}
              placeholder={t('Select theme image...')}
              showPreview={true}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="themes_block_title">{t('Block Title')}</Label>
            <Input
              id="themes_block_title"
              value={section.block_title || ''}
              onChange={(e) => updateSectionData('themes', { block_title: e.target.value })}
              placeholder={t('Designed to Impress')}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="themes_block_subtitle">{t('Block Subtitle')}</Label>
            <Textarea
              id="themes_block_subtitle"
              value={section.block_subtitle || ''}
              onChange={(e) => updateSectionData('themes', { block_subtitle: e.target.value })}
              placeholder={t('Bring a refined visual language that stays consistent across every landing page section and template preview.')}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="themes_cta_text">{t('CTA Text')}</Label>
              <Input
                id="themes_cta_text"
                value={section.cta_text || ''}
                onChange={(e) => updateSectionData('themes', { cta_text: e.target.value })}
                placeholder={t('Get Started')}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="themes_cta_link">{t('CTA Link')}</Label>
              <Input
                id="themes_cta_link"
                value={section.cta_link || ''}
                onChange={(e) => updateSectionData('themes', { cta_link: e.target.value })}
                placeholder={t('/register')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Palette className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Theme Benefits')}</h3>
            <p className="text-sm text-gray-500">{t('Add the benefit values shown in the section')}</p>
          </div>
        </div>

        <Repeater
          fields={[
            {
              name: 'value',
              label: t('Value'),
              type: 'text',
              placeholder: t('Brand consistency'),
              required: true,
            }
          ]}
          value={section.benefits_list || []}
          onChange={(benefits_list) => updateSectionData('themes', { benefits_list })}
          minItems={0}
          maxItems={-1}
          addButtonText={t('Add Benefit')}
          removeButtonText=""
          showItemNumbers={true}
          allowReorder={false}
          emptyMessage={t('No benefits added yet.')}
        />
      </div>
    </div>
  );
}
