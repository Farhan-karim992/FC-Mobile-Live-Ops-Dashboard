import React from 'react';
import { Search, Plus, ArrowUpDown, Filter } from 'lucide-react';
import { EventFilterState } from '../../types';
import { Button } from '../common/Button';

interface EventFilterBarProps {
  filters: EventFilterState;
  onFilterChange: (updates: Partial<EventFilterState>) => void;
  onOpenCreate: () => void;
  totalCount: number;
}

export const EventFilterBar: React.FC<EventFilterBarProps> = ({
  filters,
  onFilterChange,
  onOpenCreate,
  totalCount,
}) => {
  const statusOptions = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Paused', value: 'PAUSED' },
    { label: 'Concluded', value: 'CONCLUDED' },
  ];

  const typeOptions = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Promos', value: 'PROMO' },
    { label: 'Tournaments', value: 'TOURNAMENT' },
    { label: 'Flash Sales', value: 'FLASH_SALE' },
    { label: 'Milestones', value: 'MILESTONE' },
    { label: 'Challenges', value: 'CHALLENGE' },
  ];

  const sortOptions = [
    { label: 'Expiry Date', value: 'endDate' },
    { label: 'Participant Count', value: 'participants' },
    { label: 'Progress %', value: 'progress' },
    { label: 'Title (A-Z)', value: 'title' },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Top Search & Actions row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search events by title, reward, tag (e.g. TOTY, Zidane, Flash)..."
            value={filters.search}
            onChange={e => onFilterChange({ search: e.target.value })}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button variant="primary" size="md" leftIcon={<Plus size={16} />} onClick={onOpenCreate}>
            New Live Event
          </Button>
        </div>
      </div>

      {/* Filter Chips & Dropdowns row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={12} /> Status:
          </span>
          {statusOptions.map(opt => {
            const isSelected = filters.status === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onFilterChange({ status: opt.value })}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--fc-volt)' : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(0, 255, 135, 0.15)' : 'var(--bg-secondary)',
                  color: isSelected ? 'var(--fc-volt)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Category & Sorting Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="input-field select-field"
            value={filters.type}
            onChange={e => onFilterChange({ type: e.target.value })}
            style={{ width: 'auto', minWidth: '140px', padding: '0.35rem 1.8rem 0.35rem 0.65rem', fontSize: '0.75rem' }}
          >
            {typeOptions.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            className="input-field select-field"
            value={filters.sort}
            onChange={e => onFilterChange({ sort: e.target.value })}
            style={{ width: 'auto', minWidth: '140px', padding: '0.35rem 1.8rem 0.35rem 0.65rem', fontSize: '0.75rem' }}
          >
            {sortOptions.map(s => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onFilterChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
            title={`Sort ${filters.order === 'asc' ? 'Descending' : 'Ascending'}`}
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <ArrowUpDown size={14} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{filters.order}</span>
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
            ({totalCount} items)
          </span>
        </div>
      </div>
    </div>
  );
};
