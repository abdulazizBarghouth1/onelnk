import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Repeater } from '@/components/ui/repeater';
import { Palette, Type, Workflow } from 'lucide-react';

interface HowItWorksSettingsProps {
  data?: any;
  setData?: (key: string, value: any) => void;
  errors?: any;
  handleInputChange?: (field: string, value: any) => void;
  getSectionData: (key: string) => any;
  updateSectionData: (sectionKey: string, updates: Record<string, any>) => void;
  updateSectionVisibility: (sectionKey: string, visible: boolean) => void;
  t: (key: string) => string;
}

export default function HowItWorksSettings({
  getSectionData,
  updateSectionData,
  updateSectionVisibility,
  t,
}: HowItWorksSettingsProps) {
  const section = getSectionData('how_it_works');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Palette className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('How It Works Colors')}</h3>
              <p className="text-sm text-gray-500">{t('Set background and text colors for the how it works section')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t('Enable Section')}</Label>
            <Switch
              checked={section?.active !== false}
              onCheckedChange={(checked) => updateSectionVisibility('how_it_works', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div className="space-y-3">
            <Label htmlFor="how_it_works_background_color">{t('Background Color')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="how_it_works_background_color_picker"
                type="color"
                value={section.background_color || '#f8fafc'}
                onChange={(e) => updateSectionData('how_it_works', { background_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                id="how_it_works_background_color"
                value={section.background_color || '#f8fafc'}
                onChange={(e) => updateSectionData('how_it_works', { background_color: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="how_it_works_text_color">{t('Text Color')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="how_it_works_text_color_picker"
                type="color"
                value={section.text_color || '#111827'}
                onChange={(e) => updateSectionData('how_it_works', { text_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                id="how_it_works_text_color"
                value={section.text_color || '#111827'}
                onChange={(e) => updateSectionData('how_it_works', { text_color: e.target.value })}
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
            <h3 className="text-lg font-semibold text-gray-900">{t('How It Works Content')}</h3>
            <p className="text-sm text-gray-500">{t('Title and subtitle for the section')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label htmlFor="how_it_works_title">{t('Section Title')}</Label>
            <Input
              id="how_it_works_title"
              value={section.title || ''}
              onChange={(e) => updateSectionData('how_it_works', { title: e.target.value })}
              placeholder={t('How vCard Works')}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="how_it_works_subtitle">{t('Section Subtitle')}</Label>
            <Textarea
              id="how_it_works_subtitle"
              value={section.subtitle || ''}
              onChange={(e) => updateSectionData('how_it_works', { subtitle: e.target.value })}
              placeholder={t('Launch your digital business card SaaS, onboard users, and let them share interactive vCards in minutes.')}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Workflow className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('How It Works Steps')}</h3>
            <p className="text-sm text-gray-500">{t('Add the icon, icon color, title and description for each step')}</p>
          </div>
        </div>

        <Repeater
          fields={[
            {
              name: 'icon',
              label: t('Icon'),
              type: 'select',
              placeholder: t('Select icon'),
              required: true,
              options: [
                { value: 'layout-grid', label: 'Layout Grid' },
                { value: 'credit-card', label: 'Credit Card' },
                { value: 'users', label: 'Users' },
                { value: 'qr-code', label: 'QR Code' },
                { value: 'send', label: 'Send' },
                { value: 'share-2', label: 'Share' },
                { value: 'rocket', label: 'Rocket' },
                { value: 'check-circle-2', label: 'Check Circle' },
                { value: 'scan-line', label: 'Scan Line' },
                { value: 'workflow', label: 'Workflow' },
                { value: 'database', label: 'Database' },
                { value: 'shield-check', label: 'Shield Check' },
                { value: 'mouse-pointer-click', label: 'Mouse Pointer Click' },
                { value: 'user-plus', label: 'User Plus' },
                { value: 'palette', label: 'Palette' },
                { value: 'layers-3', label: 'Layers' },
                { value: 'sparkles', label: 'Sparkles' },
                { value: 'compass', label: 'Compass' },
                { value: 'circle-dot', label: 'Circle Dot' },
              ],
            },
            { name: 'icon_color', label: t('Icon Color'), type: 'color', placeholder: t('#10b981'), required: true },
            { name: 'title', label: t('Title'), type: 'text', placeholder: t('Create Your Profile'), required: true },
            { name: 'description', label: t('Description'), type: 'textarea', placeholder: t('Add your details and brand your digital card.'), required: true },
          ]}
          value={section.steps_list || []}
          onChange={(steps_list) => updateSectionData('how_it_works', { steps_list })}
          minItems={0}
          maxItems={-1}
          addButtonText={t('Add Step')}
          removeButtonText=""
          showItemNumbers={true}
          allowReorder={false}
          emptyMessage={t('No steps added yet.')}
        />
      </div>
    </div>
  );
}
