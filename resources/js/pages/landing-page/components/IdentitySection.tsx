import { useTranslation } from 'react-i18next';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
}

/** OneLnk "Digital Identity" — ported 1:1 from the static design (scoped). */
export default function IdentitySection(_props: Props) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  const points: Array<[string, string]> = [
    [t('Update Anytime:'), t('Change your info, add new links, update your photo — your card stays current without reprinting.')],
    [t('No App Required:'), t("Your profile opens directly in any browser. No downloads, no sign-ups needed for the person you're sharing with.")],
    [t('Works Everywhere:'), t('Compatible with every smartphone and operating system. iPhone, Android, whatever — it just works.')],
  ];

  return (
    <div className="onelnk-landing">
      <section className="identity" aria-labelledby="identity-title">
        <div className="section-head">
          <h2 className="section-head__title section-head__title--cap" id="identity-title">
            {t('Your Complete Digital Identity')}
          </h2>
          <p className="section-head__lede">
            {t('One tap on your NFC card opens a stunning digital profile — everything they need, right on their phone.')}
          </p>
        </div>

        <div className="identity__card">
          <div className="identity__text">
            <div className="identity__heading">
              <h3 className="identity__title">{t('Everything they need, right on their phone.')}</h3>
              <p className="identity__lede">
                {t('When someone taps your OneLnk card, they instantly see your complete digital profile — no app required. Every detail, beautifully presented.')}
              </p>
            </div>

            <ul className="identity__points">
              {points.map(([label, text]) => (
                <li className="identity__point" key={label}>
                  <span className="identity__point-icon">
                    <img src={img('s7-check.svg')} alt="" />
                  </span>
                  <p>
                    <b>{label}</b> {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="identity__media">
            <img src={img('s7-profile.png')} alt={t('A OneLnk digital profile shown on a phone')} />
          </div>
        </div>
      </section>
    </div>
  );
}
