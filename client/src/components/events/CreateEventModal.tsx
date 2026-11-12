import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { LiveEvent, EventCategory, EventStatus, EventPriority } from '../../types';
import { validateEvent } from '../../utils/eventUtils';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LiveEvent>) => Promise<void>;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('SEASONAL');
  const [status, setStatus] = useState<EventStatus>('ACTIVE');
  const [priority, setPriority] = useState<EventPriority>('HIGH');
  const [isFeatured, setIsFeatured] = useState(false);
  const [rewardTier, setRewardTier] = useState('');

  // Default start date = now, end date = now + 7 days
  const nowIsoLocal = new Date().toISOString().substring(0, 16);
  const defaultEndIsoLocal = new Date(Date.now() + 7 * 86400 * 1000).toISOString().substring(0, 16);

  const [startDate, setStartDate] = useState(nowIsoLocal);
  const [endDate, setEndDate] = useState(defaultEndIsoLocal);
  const [minOvr, setMinOvr] = useState('85');
  const [tags, setTags] = useState('LiveOps, Season, Special');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const startIso = new Date(startDate).toISOString();
    const endIso = new Date(endDate).toISOString();

    // Event validation check: prevents end date before start date
    const validation = validateEvent({
      title,
      startDate: startIso,
      endDate: endIso,
    });

    if (!validation.isValid) {
      setError(validation.errors.join(' '));
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        title,
        subtitle: subtitle || 'New Live-Ops Campaign',
        description,
        category,
        type: category,
        status,
        priority,
        isFeatured,
        rewardTier: rewardTier || '94+ OVR Special Edition Pack',
        bannerUrl,
        startDate: startIso,
        endDate: endIso,
        resetTimeDailyUtc: '19:00 UTC',
        requirements: {
          minOvr: parseInt(minOvr, 10) || 85,
          energyCostPerMatch: 10,
        },
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
        updatedBy: 'operator@eafc.live',
      });

      // reset & close
      setTitle('');
      setSubtitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create live event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Live-Ops Event"
      subtitle="Configure campaign metadata, schedule timestamps, squad requirements, and rewards"
      footer={
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={handleSubmit} type="button">
            Launch Event
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div style={{ padding: '0.6rem 0.9rem', background: 'rgba(255,51,102,0.1)', border: '1px solid var(--fc-crimson)', borderRadius: 'var(--radius-sm)', color: 'var(--fc-crimson)', fontSize: '0.8rem' }}>
            ⚠️ {error}
          </div>
        )}

        <Input
          label="Event Name *"
          placeholder="e.g. Winter Wildcards: Frostbite Festival"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <Input
          label="Subtitle / Headline"
          placeholder="e.g. Claim daily gifts and frost tokens to unlock 96 OVR Master items"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Description & Reward Rules *
          </label>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Detailed rules, match format, reward redemption track..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ resize: 'vertical' }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          <Select
            label="Event Category"
            value={category}
            onChange={e => setCategory(e.target.value as EventCategory)}
            options={[
              { value: 'SEASONAL', label: 'Seasonal Event' },
              { value: 'SPECIAL', label: 'Special Event' },
              { value: 'TOURNAMENT', label: 'Tournament' },
              { value: 'FLASH_SALE', label: 'Flash 24H Sale' },
              { value: 'CHALLENGE', label: 'Challenge Mode' },
              { value: 'MILESTONE', label: 'Milestone Journey' },
            ]}
          />

          <Select
            label="Initial Status"
            value={status}
            onChange={e => setStatus(e.target.value as EventStatus)}
            options={[
              { value: 'ACTIVE', label: 'Active (Live Now)' },
              { value: 'UPCOMING', label: 'Upcoming (Scheduled)' },
              { value: 'PAUSED', label: 'Paused (Operator Hold)' },
            ]}
          />

          <Select
            label="Priority Level"
            value={priority}
            onChange={e => setPriority(e.target.value as EventPriority)}
            options={[
              { value: 'CRITICAL', label: 'Critical (Flash)' },
              { value: 'HIGH', label: 'High Priority' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'NORMAL', label: 'Normal' },
            ]}
          />
        </div>

        {/* Start Date & End Date scheduling */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="Start Date *"
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />

          <Input
            label="End Date *"
            type="datetime-local"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="Top Reward Tier"
            placeholder="e.g. 96+ OVR Prime Icon Selection Pack"
            value={rewardTier}
            onChange={e => setRewardTier(e.target.value)}
          />

          <Input
            label="Squad Min OVR"
            type="number"
            min="60"
            max="115"
            value={minOvr}
            onChange={e => setMinOvr(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
          <input
            type="checkbox"
            id="createFeaturedCheckbox"
            checked={isFeatured}
            onChange={e => setIsFeatured(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--fc-volt)', cursor: 'pointer' }}
          />
          <label htmlFor="createFeaturedCheckbox" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
            ★ Mark as Featured Event
          </label>
        </div>

        <Input
          label="Banner Image URL"
          value={bannerUrl}
          onChange={e => setBannerUrl(e.target.value)}
          hint="Direct image link for event cover art"
        />

        <Input
          label="Tags (Comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
      </form>
    </Modal>
  );
};
