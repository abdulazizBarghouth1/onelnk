import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Header from '../landing-page/components/Header';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-wizard.css';

const img = (name: string) => `/images/onelnk/${name}`;

export default function Confirmation() {
  const { t } = useTranslation();
  const { order, settings, auth } = usePage<any>().props;
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};
  const primaryColor = settings?.config_sections?.theme?.primary_color || '#27aae1';

  return (
    <>
      <Head title={`${t('Order Confirmed')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-wizard">
        <div className="wz">
          <div className="wz__body">
            <section className="wzpanel">
              <div className="wzconfirm">
                <img className="wzconfirm__icon" src={img('wz-success.svg')} alt="" />
                <div className="wzconfirm__heading">
                  <h1 className="wzconfirm__title">{t('Order Confirmed!')}</h1>
                  <p className="wzconfirm__sub">
                    {t('Thank you, :name! Your NFC card is being crafted.', { name: order?.recipient || '' })}
                  </p>
                </div>
                <span className="wzconfirm__order">{t('ORDER')} #{order?.order_number}</span>

                <div className="wzconfirm__card">
                  <img src={img('wz-card-back.svg')} alt={t('Your OneLnk card back')} />
                </div>

                <div className="wzconfirm__delivery">
                  <img src={img('wz-truck.svg')} alt="" />
                  <div>
                    <b>{t('Estimated Delivery 5-7 business days')}</b>
                    <span>{order?.city || ''}</span>
                  </div>
                </div>

                <div className="wzconfirm__actions">
                  <a className="btn btn--primary" href={order?.profile_url || '#'}>{t('View your digital profile')}</a>
                  <Link className="btn btn--navy" href={route('marketing.contact')}>{t('Chat with support')}</Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
