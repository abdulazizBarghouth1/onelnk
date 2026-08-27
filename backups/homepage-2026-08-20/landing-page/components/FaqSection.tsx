import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  brandColor?: string;
  faqs?: Faq[];
  settings?: any;
  sectionData?: {
    title?: string;
    button_text?: string;
    button_link?: string;
    default_faqs?: Array<{ question: string; answer: string }>;
    [key: string]: any;
  };
}

/**
 * OneLnk FAQ — ported 1:1 from the static design (scoped, native <details>
 * accordion). FAQ entries stay admin-driven (settings → faqs prop → defaults),
 * falling back to the OneLnk static questions.
 */
export default function FaqSection({ faqs = [], settings, sectionData = {} }: FaqSectionProps) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  const settingsFaqs =
    settings?.config_sections?.sections
      ?.find((section: any) => section.key === 'faq')
      ?.faqs?.map((faq: any, i: number) => ({ id: i + 1, question: faq.question, answer: faq.answer })) || [];

  const backendFaqs = (sectionData.default_faqs || []).map((faq, i) => ({ id: i + 1, ...faq }));

  const fallback: Faq[] = [
    { id: 1, question: t('Do people need an app to open my card?'), answer: '' },
    { id: 2, question: t('Can I update my information later?'), answer: '' },
    { id: 3, question: t('Can I customize the physical card?'), answer: '' },
    { id: 4, question: t('Does it work with iPhone and Android?'), answer: '' },
    {
      id: 5,
      question: t('Can I order for my team?'),
      answer: t('Yes, our Teams plan is built exactly for this. You can manage all employee profiles from one dashboard, apply consistent branding, and place bulk orders with discounted pricing. Contact us for a custom quote.'),
    },
    { id: 6, question: t('How long does delivery take?'), answer: '' },
  ];

  const displayFaqs: Faq[] =
    settingsFaqs.length > 0 ? settingsFaqs : faqs.length > 0 ? faqs : backendFaqs.length > 0 ? backendFaqs : fallback;

  return (
    <div className="onelnk-landing">
      <section className="faq" aria-labelledby="faq-title">
        <div className="faq__intro">
          <h2 className="faq__title" id="faq-title">
            {sectionData.title ? (
              sectionData.title
            ) : (
              <>
                {t('Frequently Asked')}
                <br />
                {t('Questions')}
              </>
            )}
          </h2>
          <Link href={sectionData.button_link || '#contact'} className="btn btn--primary benefits__cta">
            {sectionData.button_text || t('Contact Us')}
          </Link>
        </div>

        <div className="faq__list">
          {displayFaqs.map((faq, i) => (
            <details className="faq__item" key={faq.id ?? i} open={!!faq.answer && i === displayFaqs.findIndex((f) => f.answer)}>
              <summary className="faq__q">
                <span>{faq.question}</span>
                <span className="faq__toggle">
                  <img className="is-closed" src={img('s12-plus.svg')} alt="" />
                  <img className="is-open" src={img('s12-minus.svg')} alt="" />
                </span>
              </summary>
              {faq.answer ? <p className="faq__a">{faq.answer}</p> : null}
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
