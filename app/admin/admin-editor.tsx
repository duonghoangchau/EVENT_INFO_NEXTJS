'use client';
import { useState } from 'react';
import type { EventPhotoItem, SiteContent } from '@/lib/content';

const textFields = [
  'siteTitle',
  'logoUrl',
  'zaloUrl',
  'bannerImageUrl',
  'bannerTitle',
  'bannerSubtitle',
  'letterTitle',
  'leaderImageUrl',
  'eventName',
  'eventTime',
  'eventDateISO',
  'eventLocation',
  'eventMapUrl',
  'journeyTitleTop',
  'journeyTitleBottom',
  'memoryTitle',
  'memoryCaption',
  'eventPhotosTitle',
  'footerCompany',
  'footerUrl'
];
const areaFields = ['letterHtml'];
const arrayFields: string[] = [];

function setFieldValue(old: any, key: string, value: any) {
  return { ...old, [key]: value };
}

function serializeEventPhotos(items: EventPhotoItem[] = []) {
  return items
    .map((item) => [item.imageUrl || '', item.linkUrl || '', item.title || ''].join(' | '))
    .join('\n');
}

function parseEventPhotos(value: string): EventPhotoItem[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [imageUrl = '', linkUrl = '', title = ''] = line.split('|').map((part) => part.trim());
      return { imageUrl, linkUrl, title };
    })
    .filter((item) => item.imageUrl);
}

export default function AdminEditor({ initial }: { initial: SiteContent }) {
  const [data, setData] = useState<any>(initial);
  const [journeyDraft, setJourneyDraft] = useState(JSON.stringify(initial.journey, null, 2));
  const [status, setStatus] = useState('');

  function setField(key: string, value: any) {
    setData((old: any) => setFieldValue(old, key, value));
  }

  async function save() {
    try {
      JSON.parse(journeyDraft);
    } catch {
      setStatus('Journey JSON chưa hợp lệ, chưa thể lưu');
      return;
    }

    setStatus('Đang lưu...');
    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setStatus(res.ok ? 'Đã lưu thành công. Trang public đã cập nhật.' : 'Lưu thất bại. Vui lòng đăng nhập lại hoặc kiểm tra dữ liệu.');
  }

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: '0 0 8px' }}>Quản trị nội dung sự kiện</h1>
            <p style={{ margin: 0, color: '#64748b' }}>
              Sửa nội dung ở đây, bấm lưu là trang public cập nhật. JSON hơi nhà quê nhưng bền như bình ắc quy.
            </p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="admin-btn admin-danger">Đăng xuất</button>
          </form>
        </div>

        <div className="admin-actions">
          <a className="admin-btn" href="/" target="_blank" rel="noreferrer">
            Xem trang public
          </a>
          <button className="admin-btn" onClick={save}>
            Lưu nội dung
          </button>
          <span>{status}</span>
        </div>

        <div className="admin-grid" style={{ marginTop: 20 }}>
          {textFields.map((k) => (
            <div className="admin-field" key={k}>
              <label>{k}</label>
              <input value={data[k] || ''} onChange={(e) => setField(k, e.target.value)} />
            </div>
          ))}

          {areaFields.map((k) => (
            <div className="admin-field full" key={k}>
              <label>{k}</label>
              <textarea value={data[k] || ''} onChange={(e) => setField(k, e.target.value)} />
            </div>
          ))}

          {arrayFields.map((k) => (
            <div className="admin-field full" key={k}>
              <label>{k} - mỗi dòng 1 URL ảnh</label>
              <textarea
                value={(data[k] || []).join('\n')}
                onChange={(e) => setField(k, e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))}
              />
            </div>
          ))}

          <div className="admin-field full">
            <label>eventPhotos - mỗi dòng: URL ảnh | Link Google Drive | Tiêu đề</label>
            <textarea
              style={{ minHeight: 180 }}
              value={serializeEventPhotos(data.eventPhotos)}
              onChange={(e) => setField('eventPhotos', parseEventPhotos(e.target.value))}
            />
          </div>

          <div className="admin-field full">
            <label>journey - JSON theo từng giai đoạn</label>
            <textarea
              style={{ minHeight: 220, fontFamily: 'monospace' }}
              value={journeyDraft}
              onChange={(e) => {
                const nextValue = e.target.value;
                setJourneyDraft(nextValue);
                try {
                  setField('journey', JSON.parse(nextValue));
                  setStatus('');
                } catch {
                  setStatus('Journey JSON chưa hợp lệ');
                }
              }}
            />
          </div>
        </div>

        <div className="admin-actions">
          <button className="admin-btn" onClick={save}>
            Lưu nội dung
          </button>
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
}
