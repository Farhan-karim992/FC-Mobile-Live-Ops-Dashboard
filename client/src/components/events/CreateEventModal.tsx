import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { LiveEvent, EventType, EventStatus, EventPriority } from '../../types';

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
  const [type, setType] = useState<EventType>('PROMO');
  const [status, setStatus] = useState<EventStatus>('ACTIVE');
  const [priority, setPriority] = useState<EventPriority>('HIGH');
  const [rewardTier, setRewardTier] = useState('');
  const [durationDays, setDurationDays] = useState('7');
  const [minOvr, setMinOvr] = useState('85');
  const [tags, setTags] = useState('LiveOps, Weekend, Promo');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const days = parseInt(durationDays, 10) || 7;
      const endDate = new Date(Date.now() + days * 86400 * 1000).toISOString();

      await onSubmit({
        title,
        subtitle: subtitle || 'New Live-Ops Campaign',
        description,
        type,
        status,
        priority,
        rewardTier: rewardTier || '94+ OVR Special Edition Pack',
        bannerUrl,
        startDate: new Date().toISOString(),
        endDate,
        resetTimeDailyUtc: '19:00 UTC',
        requirements: {
          minOvr: parseInt(minOvr, 10) || 85,
          energyCostPerMatch: 10,
        },
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      // reset & close
      setTitle('');
      setSubtitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Live-Ops Event"
      subtitle="Configure event metadata, phase duration, squad requirements, and rewards"
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
          <div style={{ padding: '0.6rem 0.9rem', background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--fc-crimson)', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}

        <Input
          label="Event Title *"
          placeholder="e.g. Winter Wildcards: Frostbite Festival"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <Input
          label="Subtitle / Tagline"
          placeholder="e.g. Claim daily gifts and frost tokens to unlock 96 OVR Master items"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Event Description & Mechanics *
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <Select
            label="Event Type"
            value={type}
            onChange={e => setType(e.target.value as EventType)}
            options={[
              { value: 'PROMO', label: 'Promo Campaign' },
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
              { value: 'PAUSED', label: 'Paused' },
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="Duration (Days)"
            type="number"
            min="1"
            max="60"
            value={durationDays}
            onChange={e => setDurationDays(e.target.value)}
          />

          <Input
            label="Squad Min OVR"
            type="number"
            min="60"
            max="110"
            value={minOvr}
            onChange={e => setMinOvr(e.target.value)}
          />
        </div>

        <Input
          label="Top Reward Tier"
          placeholder="e.g. 96+ OVR Prime Icon Selection Pack"
          value={rewardTier}
          onChange={e => setRewardTier(e.target.value)}
        />

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
