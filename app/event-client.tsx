'use client';

import { useEffect, useMemo, useState } from 'react';
import type { EventPhotoItem, SiteContent } from '@/lib/content';

export default function EventClient({ content }: { content: SiteContent }) {
  const years = Object.keys(content.journey || {});
  const [activeYear, setActiveYear] = useState(years[0]);
  const [journeyGalleryYear, setJourneyGalleryYear] = useState<string | null>(null);
  const [letterExpanded, setLetterExpanded] = useState(false);
  const [lightbox, setLightbox] = useState('');
  const [hiddenCountdown, setHiddenCountdown] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [offsets, setOffsets] = useState<Record<string, number>>({ c1: 0, c2: 0, c3: 0 });

  const activeImages = useMemo(() => content.journey?.[activeYear] || [], [content.journey, activeYear]);
  const eventPhotoItems = useMemo(() => content.eventPhotos || [], [content.eventPhotos]);
  const journeyGalleryImages = useMemo(
    () => (journeyGalleryYear ? content.journey?.[journeyGalleryYear] || [] : []),
    [content.journey, journeyGalleryYear]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(content.eventDateISO).getTime() - Date.now();
      if (diff <= 0) return setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });

      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [content.eventDateISO]);

  function scrollCarousel(id: string, dir: number) {
    const track = document.getElementById(id);
    if (!track) return;

    const card = track.querySelector('.carousel-card, .memory-card, .event-photo-slide') as HTMLElement | null;
    if (!card) return;

    const cardW = card.offsetWidth + 20;
    const visible = track.parentElement?.clientWidth || 0;
    const maxOff = Math.max(0, track.scrollWidth - visible);
    const next = Math.max(0, Math.min((offsets[id] || 0) + dir * cardW * 3, maxOff));
    setOffsets((prev) => ({ ...prev, [id]: next }));
  }

  function padCountdown(value: number) {
    return String(Math.max(0, value)).padStart(2, '0');
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand-wrapper">
          <img src={content.logoUrl} alt="Logo" />
        </div>
        <div className="navbar-menu-wrapper" />
      </nav>

      <div className="container-scroller">
        <section className="banner-section">
          {content.bannerImageUrl ? <img src={content.bannerImageUrl} alt={content.siteTitle} /> : null}
          {!content.bannerImageUrl && (
            <div className="banner-fallback">
              <div className="logo-circle">
                PINACO
                <br />
                50 NĂM
              </div>
              <div className="b-title">{content.bannerTitle}</div>
              <div className="b-sub">{content.bannerSubtitle}</div>
            </div>
          )}
        </section>

        <section className="section-wrap letter-section">
          <div className="section-inner">
            <div className="section-rule-title">{content.letterTitle}</div>
            <div className={`letter-content ${letterExpanded ? 'expanded' : ''}`}>
              <div className="clearfix">
                <div className="leader-img">
                  <img src={content.leaderImageUrl} alt="Leader" />
                </div>
                <div className="letter-text" dangerouslySetInnerHTML={{ __html: content.letterHtml }} />
              </div>
            </div>
            <div className="letter-actions">
              <button className="btn-xem-them" type="button" onClick={() => setLetterExpanded((prev) => !prev)}>
                <i className={`fa ${letterExpanded ? 'fa-chevron-up' : 'fa-folder-open'}`} />{' '}
                {letterExpanded ? 'THU GỌN' : 'XEM THÊM'}
              </button>
            </div>
          </div>
        </section>

        <section className="event-banner-section">
          <div className="event-banner-inner">
            <div className="event-banner-icon">
              <i className="fa fa-gift" />
            </div>
            <div className="event-banner-title">{content.eventName}</div>
            <div className="event-info">
              <p style={{ margin: '0 0 4px' }}>
                <strong>Thời gian:</strong> {content.eventTime}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Địa điểm:</strong> {content.eventLocation}{' '}
                <a href={content.eventMapUrl} target="_blank" rel="noreferrer">
                  <i className="fa fa-external-link" />
                </a>
              </p>
            </div>
            <div className="event-countdown" aria-label="Thời gian đếm ngược đến lễ kỷ niệm">
              <div className="event-countdown-item">
                <div className="event-countdown-num">{padCountdown(countdown.days)}</div>
                <div className="event-countdown-label">Ngày</div>
              </div>
              <div className="event-countdown-sep">:</div>
              <div className="event-countdown-item">
                <div className="event-countdown-num">{padCountdown(countdown.hours)}</div>
                <div className="event-countdown-label">Giờ</div>
              </div>
              <div className="event-countdown-sep">:</div>
              <div className="event-countdown-item">
                <div className="event-countdown-num">{padCountdown(countdown.mins)}</div>
                <div className="event-countdown-label">Phút</div>
              </div>
            </div>
          </div>
        </section>

        {/* Hidden for now. Restore this reward section when you need the tribute/gift program content again.
        <section className="section-wrap reward-section">
          <div className="section-inner" style={{ textAlign: 'center' }}>
            <div className="big-title light">{content.rewardTitle1}</div>
            <div className="big-title" style={{ marginTop: 4 }}>
              {content.rewardTitle2}
            </div>
            <div className="reward-desc">{content.rewardDesc}</div>
            <div className="alert-box">{content.rewardAlert}</div>
          </div>
        </section>

        <Carousel
          id="c1"
          title={content.carousel1Title}
          images={content.carousel1Images}
          offset={offsets.c1 || 0}
          onScroll={scrollCarousel}
          onOpen={setLightbox}
        />
        */}

        <section className="journey-section">
          <div className="journey-title-wrap">
            <div className="journey-title-top">{content.journeyTitleTop}</div>
            <div className="journey-title-bottom">{content.journeyTitleBottom}</div>
          </div>

          <div className="journey-layout">
            <div className="journey-sidebar">
              {years.map((y) => (
                <div
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={`journey-year ${activeYear === y ? 'active' : ''}`}
                >
                  {y}
                </div>
              ))}
            </div>

            <div className="journey-preview" onClick={() => setJourneyGalleryYear(activeYear)}>
              <div className="journey-preview-stack">
                {activeImages.slice(0, 3).map((src: string, i: number) => (
                  <div key={src + i} className="journey-preview-card journey-preview-small">
                    <img src={src} alt="" />
                    <div className="journey-preview-overlay">
                      <span>XEM TẤT CẢ ẢNH</span>
                    </div>
                  </div>
                ))}
              </div>
              {activeImages[3] ? (
                <div className="journey-preview-card journey-preview-large">
                  <img src={activeImages[3]} alt="" />
                  <div className="journey-preview-overlay">
                    <span>XEM TẤT CẢ ẢNH</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Hidden for now. Restore this memory section when you want to show the PINACO memories carousel again.
        <section className="memory-section">
          <div className="memory-title">{content.memoryTitle}</div>
          <div style={{ position: 'relative', padding: '0 50px' }}>
            <button className="carousel-nav-btn prev" onClick={() => scrollCarousel('c2', -1)}>
              <i className="fa fa-arrow-left" />
            </button>
            <div className="carousel-track-wrap">
              <div className="carousel-track" id="c2" style={{ transform: `translateX(-${offsets.c2 || 0}px)` }}>
                {content.memoryImages.map((src: string, i: number) => (
                  <div className="memory-card" key={src + i} onClick={() => setLightbox(src)}>
                    <img src={src} alt="" />
                    <div className="memory-card-overlay">
                      <span>
                        <i className="fa fa-eye" /> XEM ẢNH
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-nav-btn next" onClick={() => scrollCarousel('c2', 1)}>
              <i className="fa fa-arrow-right" />
            </button>
          </div>
          <div className="memory-caption">{content.memoryCaption}</div>
          <div className="memory-action-wrap">
            <button className="btn-memory">
              <i className="fa fa-camera" /> CHIA SẺ KỶ NIỆM
            </button>
            <button className="btn-memory red">
              <i className="fa fa-photo" /> ẢNH CÓ TÔI
            </button>
          </div>
        </section>
        */}

        <section className="event-photos-section" style={{ marginBottom: 60 }}>
          <div className="big-title light" style={{ fontSize: 'clamp(24px,4vw,40px)', marginBottom: 30 }}>
            {content.eventPhotosTitle}
          </div>
          <div style={{ position: 'relative', padding: '0 50px' }}>
            <button className="carousel-nav-btn prev" onClick={() => scrollCarousel('c3', -1)}>
              <i className="fa fa-arrow-left" />
            </button>
            <div className="carousel-track-wrap">
              <div className="carousel-track" id="c3" style={{ transform: `translateX(-${offsets.c3 || 0}px)` }}>
                {eventPhotoItems.map((item, i) => (
                  <EventPhotoSlide key={`${item.imageUrl}-${i}`} item={item} onPreview={() => setLightbox(item.imageUrl)} />
                ))}
              </div>
            </div>
            <button className="carousel-nav-btn next" onClick={() => scrollCarousel('c3', 1)}>
              <i className="fa fa-arrow-right" />
            </button>
          </div>
        </section>

        <footer className="footer">
          <span>Copyright © 2026</span>
          <a href={content.footerUrl} target="_blank" rel="noreferrer">
            {' '}
            {content.footerCompany}{' '}
          </a>
          <span>All rights reserved.</span>
        </footer>
      </div>

      {!hiddenCountdown && (
        <div className="countdown-float">
          <div className="countdown-card">
            <button className="countdown-close" onClick={() => setHiddenCountdown(true)}>
              x
            </button>
            <div className="countdown-label">CHỈ CÒN</div>
            <div className="countdown-boxes">
              {[
                ['days', 'Ngày'],
                ['hours', 'Giờ'],
                ['mins', 'Phút'],
                ['secs', 'Giây']
              ].map(([k, u]) => (
                <div className="cd-box" key={k}>
                  <div className="cd-num">{(countdown as any)[k]}</div>
                  <div className="cd-unit">{u}</div>
                </div>
              ))}
            </div>
            <div className="countdown-cta">
              <i className="fa fa-support" /> SỰ KIỆN KỶ NIỆM
            </div>
          </div>
        </div>
      )}

      {journeyGalleryYear && (
        <div className="journey-gallery-backdrop" onClick={() => setJourneyGalleryYear(null)}>
          <div className="journey-gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="journey-gallery-close" type="button" onClick={() => setJourneyGalleryYear(null)}>
              ×
            </button>
            <div className="journey-gallery-header">
              <div className="journey-gallery-year">{journeyGalleryYear}</div>
              <div className="journey-gallery-subtitle">Toàn bộ hình ảnh của giai đoạn này</div>
            </div>
            <div className="journey-gallery-grid">
              {journeyGalleryImages.map((src: string, i: number) => (
                <button
                  className="journey-gallery-card"
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setLightbox(src)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`lightbox ${lightbox ? 'show' : ''}`} onClick={() => setLightbox('')}>
        <span className="lightbox-close">x</span>
        {lightbox && <img src={lightbox} alt="" />}
      </div>
    </>
  );
}

function Carousel({ id, title, images, offset, onScroll, onOpen }: any) {
  return (
    <section className="section-wrap" style={{ paddingTop: 0 }}>
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div className="carousel-title">{title}</div>
        <div style={{ position: 'relative', padding: '0 50px' }}>
          <button className="carousel-nav-btn prev" onClick={() => onScroll(id, -1)}>
            <i className="fa fa-arrow-left" />
          </button>
          <div className="carousel-track-wrap">
            <div className="carousel-track" id={id} style={{ transform: `translateX(-${offset}px)` }}>
              {images.map((src: string, i: number) => (
                <div className="carousel-card" key={src + i} onClick={() => onOpen(src)}>
                  <img src={src} alt="" />
                  <div className="carousel-card-overlay">
                    <span>
                      <i className="fa fa-eye" /> XEM ẢNH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="carousel-nav-btn next" onClick={() => onScroll(id, 1)}>
            <i className="fa fa-arrow-right" />
          </button>
        </div>
      </div>
    </section>
  );
}

function EventPhotoSlide({ item, onPreview }: { item: EventPhotoItem; onPreview: () => void }) {
  const hasLink = Boolean(item.linkUrl);

  return (
    <div className="event-photo-slide">
      {hasLink ? (
        <a className="event-photo-card event-photo-link" href={item.linkUrl} target="_blank" rel="noreferrer">
          <img src={item.imageUrl} alt={item.title || ''} />
          <div className="event-photo-overlay">
            {item.title ? <span className="event-photo-badge">{item.title}</span> : <span />}
            <span className="event-photo-cta">MỞ FOLDER ẢNH</span>
          </div>
        </a>
      ) : (
        <button className="event-photo-card event-photo-button" type="button" onClick={onPreview}>
          <img src={item.imageUrl} alt={item.title || ''} />
          <div className="event-photo-overlay">
            {item.title ? <span className="event-photo-badge">{item.title}</span> : <span />}
            <span className="event-photo-cta">XEM ẢNH</span>
          </div>
        </button>
      )}
    </div>
  );
}
