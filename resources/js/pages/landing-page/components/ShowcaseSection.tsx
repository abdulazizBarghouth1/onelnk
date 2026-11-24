import { useTranslation } from 'react-i18next';

interface Props { settings?: any; sectionData?: any; brandColor?: string }

/** OneLnk "See It In Action" player — ported 1:1 from the static design (scoped). */
export default function ShowcaseSection(_props: Props) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  return (
    <div className="onelnk-landing">
      <section className="showcase" aria-labelledby="showcase-title">
        <div className="section-head">
          <h2 className="section-head__title" id="showcase-title">{t('See It In Action')}</h2>
          <p className="section-head__lede">{t('Watch how a single tap transforms the way you network.')}</p>
        </div>

        <div className="player">
          <div className="player__poster media-ph">960 × 540</div>

          <button className="player__play" type="button" aria-label={t('Play video')}>
            <img src={img('s10-play.svg')} alt="" />
          </button>

          <div className="player__footer" aria-hidden="true">
            <div className="player__track"><div className="player__fill"></div></div>
            <p className="player__time">0:12 / 0:45</p>
          </div>
        </div>
      </section>
    </div>
  );
}
