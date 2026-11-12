import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { LiveEvent, EventCategory, EventStatus, EventPriority } from '../../types';
import { validateEvent } from '../../utils/eventUtils';

interface EditEventModalProps {
  event: LiveEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<LiveEvent>) => Promise<void>;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minOvr, setMinOvr] = useState('85');
  const [bannerUrl, setBannerUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setSubtitle(event.subtitle || '');
      setDescription(event.description || '');
      setCategory(event.category || (event.type as EventCategory) || 'SEASONAL');
      setStatus(event.status || 'ACTIVE');
      setPriority(event.priority || 'HIGH');
      setIsFeatured(!!event.isFeatured);
      setRewardTier(event.rewardTier || '');
      setStartDate(event.startDate ? event.startDate.substring(0, 16) : '');
      setEndDate(event.endDate ? event.endDate.substring(0, 16) : '');
      setMinOvr(event.requirements?.minOvr ? event.requirements.minOvr.toString() : '85');
      setBannerUrl(event.bannerUrl || '');
      setTags(event.tags ? event.tags.join(', ') : '');
      setError('');
    }
  }, [event]);

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-validate dates
    const validation = validateEvent({
      title,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });

    if (!validation.isValid) {
      setError(validation.errors.join(' '));
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(event.id, {
        title,
        subtitle,
        description,
        category,
        type: category,
        status,
        priority,
        isFeatured,
        rewardTier,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        bannerUrl,
        requirements: {
          minOvr: parseInt(minOvr, 10) || 80,
          energyCostPerMatch: event.requirements?.energyCostPerMatch || 10,
        },
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
        updatedBy: 'operator@eafc.live',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Event: ${event.title}`}
      subtitle={`Event ID: ${event.id}`}
      footer={
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={handleSubmit} type="button">
            Save Changes
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
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <Input
          label="Subtitle / Headline"
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
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          <Select
            label="Category"
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
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value as EventStatus)}
            options={[
              { value: 'ACTIVE', label: 'Active (Live)' },
              { value: 'UPCOMING', label: 'Upcoming (Scheduled)' },
              { value: 'PAUSED', label: 'Paused (Operator Hold)' },
              { value: 'CONCLUDED', label: 'Concluded (Expired)' },
            ]}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={e => setPriority(e.target.value as EventPriority)}
            options={[
              { value: 'CRITICAL', label: 'Critical' },
              { value: 'HIGH', label: 'High' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'NORMAL', label: 'Normal' },
            ]}
          />
        </div>

        {/* Start Date & End Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="Start Date (Local Time)"
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />

          <Input
            label="End Date (Local Time)"
            type="datetime-local"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="Reward Tier"
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
            id="featuredCheckbox"
            checked={isFeatured}
            onChange={e => setIsFeatured(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--fc-volt)', cursor: 'pointer' }}
          />
          <label htmlFor="featuredCheckbox" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
            ★ Mark as Featured Event (prominently displayed on Dashboard Overview)
          </label>
        </div>

        <Input
          label="Banner Art Image URL"
          value={bannerUrl}
          onChange={e => setBannerUrl(e.target.value)}
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
