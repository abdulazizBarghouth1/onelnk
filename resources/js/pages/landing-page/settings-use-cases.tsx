import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Repeater } from '@/components/ui/repeater';
import { LayoutGrid, Palette, Type } from 'lucide-react';

interface UseCasesSettingsProps {
  data?: any;
  setData?: (key: string, value: any) => void;
  errors?: any;
  handleInputChange?: (field: string, value: any) => void;
  getSectionData: (key: string) => any;
  updateSectionData: (sectionKey: string, updates: Record<string, any>) => void;
  updateSectionVisibility: (sectionKey: string, visible: boolean) => void;
  t: (key: string) => string;
}

export default function UseCasesSettings({ getSectionData, updateSectionData, updateSectionVisibility, t }: UseCasesSettingsProps) {
  const section = getSectionData('use_cases');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Palette className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('Use Cases Colors')}</h3>
              <p className="text-sm text-gray-500">{t('Set background and text colors for the use cases section')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t('Enable Section')}</Label>
            <Switch
              checked={section?.active !== false}
              onCheckedChange={(checked) => updateSectionVisibility('use_cases', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div className="space-y-3">
            <Label htmlFor="use_cases_background_color">{t('Background Color')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="use_cases_background_color_picker"
                type="color"
                value={section.background_color || '#f8fafc'}
                onChange={(e) => updateSectionData('use_cases', { background_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                id="use_cases_background_color"
                value={section.background_color || '#f8fafc'}
                onChange={(e) => updateSectionData('use_cases', { background_color: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="use_cases_text_color">{t('Text Color')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="use_cases_text_color_picker"
                type="color"
                value={section.text_color || '#111827'}
                onChange={(e) => updateSectionData('use_cases', { text_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                id="use_cases_text_color"
                value={section.text_color || '#111827'}
                onChange={(e) => updateSectionData('use_cases', { text_color: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Type className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Use Cases Content')}</h3>
            <p className="text-sm text-gray-500">{t('Title, subtitle and cases list')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="use_cases_title">{t('Section Title')}</Label>
            <Input
              id="use_cases_title"
              value={section.title || ''}
              onChange={(e) => updateSectionData('use_cases', { title: e.target.value })}
              placeholder={t('Built for people and teams.')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="use_cases_subtitle">{t('Section Subtitle')}</Label>
            <Input
              id="use_cases_subtitle"
              value={section.subtitle || ''}
              onChange={(e) => updateSectionData('use_cases', { subtitle: e.target.value })}
              placeholder={t('Flexible for different business models, from solo creators to growing organizations.')}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <LayoutGrid className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Use Cases')}</h3>
            <p className="text-sm text-gray-500">{t('Add the case title and description items shown in the section')}</p>
          </div>
        </div>

        <Repeater
          value={section.cases_list || []}
          onChange={(cases_list) => updateSectionData('use_cases', { cases_list })}
          fields={[
            { name: 'title', label: t('Title'), type: 'text', placeholder: t('Solo Creators'), required: true },
            { name: 'description', label: t('Description'), type: 'textarea', placeholder: t('Perfect for freelancers, consultants, and independent professionals.'), required: true },
          ]}
          minItems={0}
          maxItems={-1}
          addButtonText={t('Add Case')}
          removeButtonText=""
          showItemNumbers={true}
          allowReorder={false}
          emptyMessage={t('No cases added yet.')}
        />
      </div>
    </div>
  );
}
