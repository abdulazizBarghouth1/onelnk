import { useTranslation } from 'react-i18next';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
}

/** OneLnk "How it works" — ported 1:1 from the static design (scoped). */
export default function HowToSection(_props: Props) {
  const { t } = useTranslation();

  const steps: Array<[string, string, string]> = [
    ['01', t('Customize your NFC card'), t('Choose your card style, colors, logo placement, and layout to match your brand.')],
    ['02', t('Build your digital profile'), t('Add your photo, contact details, social links, WhatsApp, portfolio links, and more.')],
    ['03', t('Tap and share instantly'), t('Hand your card to anyone — one tap opens your full digital profile. No app needed.')],
  ];

  return (
    <div className="onelnk-landing">
      <section className="howto" aria-labelledby="howto-title">
        <div className="section-head">
          <h2 className="section-head__title" id="howto-title">{t('How OneLnk Works')}</h2>
          <p className="section-head__lede">{t('Three simple steps to go fully digital')}</p>
        </div>

        <ol className="howto__steps">
          {steps.map(([num, title, text]) => (
            <li className="step" key={num}>
              <p className="step__num">{num}</p>
              <div className="step__body">
                <h3 className="step__title">{title}</h3>
                <p className="step__text">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
