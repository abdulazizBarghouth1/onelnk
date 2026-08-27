import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Palette, Type } from 'lucide-react';

interface CTASettingsProps {
  data?: any;
  setData?: (key: string, value: any) => void;
  errors?: any;
  handleInputChange?: (field: string, value: any) => void;
  getSectionData: (key: string) => any;
  updateSectionData: (sectionKey: string, updates: Record<string, any>) => void;
  updateSectionVisibility: (sectionKey: string, visible: boolean) => void;
  t: (key: string) => string;
}

export default function CTASettings({
  getSectionData,
  updateSectionData,
  updateSectionVisibility,
  t,
}: CTASettingsProps) {
  const section = getSectionData('cta');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Palette className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('CTA Colors')}</h3>
              <p className="text-sm text-gray-500">{t('Set background and text colors for the CTA section')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t('Enable Section')}</Label>
            <Switch
              checked={section?.active !== false}
              onCheckedChange={(checked) => updateSectionVisibility('cta', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div className="space-y-3">
            <Label htmlFor="cta_background_color">{t('Background Color')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cta_background_color_picker"
                type="color"
                value={section.background_color || '#ffffff'}
                onChange={(e) => updateSectionData('cta', { background_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                id="cta_background_color"
                value={section.background_color || '#ffffff'}
                onChange={(e) => updateSectionData('cta', { background_color: e.target.value })}
                
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="cta_text_color">{t('Text Color')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cta_text_color_picker"
                type="color"
                value={section.text_color || '#111827'}
                onChange={(e) => updateSectionData('cta', { text_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                id="cta_text_color"
                value={section.text_color || '#111827'}
                onChange={(e) => updateSectionData('cta', { text_color: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Type className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('CTA Content')}</h3>
            <p className="text-sm text-gray-500">{t('Configure title, subtitle, description and button')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cta_title">{t('Section Title')}</Label>
            <Input
              id="cta_title"
              value={section.title || ''}
              onChange={(e) => updateSectionData('cta', { title: e.target.value })}
              placeholder={t('Ready to Get Started?')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta_subtitle">{t('Section Subtitle')}</Label>
            <Input
              id="cta_subtitle"
              value={section.subtitle || ''}
              onChange={(e) => updateSectionData('cta', { subtitle: e.target.value })}
              placeholder={t('Create your digital presence in just a few minutes.')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta_description">{t('Description')}</Label>
            <Textarea
              id="cta_description"
              value={section.description || ''}
              onChange={(e) => updateSectionData('cta', { description: e.target.value })}
              placeholder={t('Build a polished, professional digital experience that helps you connect faster.')}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cta_button_text">{t('CTA Text')}</Label>
              <Input
                id="cta_button_text"
                value={section.cta_text || ''}
                onChange={(e) => updateSectionData('cta', { cta_text: e.target.value })}
                placeholder={t('Contact Us')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_button_link">{t('CTA Link')}</Label>
              <Input
                id="cta_button_link"
                value={section.cta_link || ''}
                onChange={(e) => updateSectionData('cta', { cta_link: e.target.value })}
                placeholder="#contact"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
