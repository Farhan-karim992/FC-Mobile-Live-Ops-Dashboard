import React from 'react';
import { Search, Plus, ArrowUpDown, Filter, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { EventFilterState } from '../../types';
import { Button } from '../common/Button';

interface EventFilterBarProps {
  filters: EventFilterState;
  onFilterChange: (updates: Partial<EventFilterState>) => void;
  onOpenCreate: () => void;
  totalFilteredCount: number;
  totalPages: number;
  currentPage: number;
  misconfiguredCount?: number;
}

export const EventFilterBar: React.FC<EventFilterBarProps> = ({
  filters,
  onFilterChange,
  onOpenCreate,
  totalFilteredCount,
  totalPages,
  currentPage,
  misconfiguredCount = 0,
}) => {
  const statusOptions = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Expired', value: 'CONCLUDED' },
    { label: 'Paused', value: 'PAUSED' },
    { label: `Misconfigured ${misconfiguredCount > 0 ? `(${misconfiguredCount})` : ''}`, value: 'MISCONFIGURED', isWarning: misconfiguredCount > 0 },
  ];

  const categoryOptions = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Seasonal', value: 'SEASONAL' },
    { label: 'Special', value: 'SPECIAL' },
    { label: 'Tournaments', value: 'TOURNAMENT' },
    { label: 'Flash Sales', value: 'FLASH_SALE' },
    { label: 'Challenges', value: 'CHALLENGE' },
    { label: 'Milestones', value: 'MILESTONE' },
  ];

  const sortOptions = [
    { label: 'Earliest Ending (Approaching Deadline)', value: 'endDate', defaultOrder: 'asc' },
    { label: 'Newest Events (Latest Start)', value: 'startDate', defaultOrder: 'desc' },
    { label: 'Oldest Events', value: 'startDateAsc', defaultOrder: 'asc' },
    { label: 'Participant Count', value: 'participants', defaultOrder: 'desc' },
    { label: 'Event Name (A-Z)', value: 'title', defaultOrder: 'asc' },
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
      {/* Top Search & Actions Row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search events by name, reward, or tag (e.g. TOTY, Zidane, Flash, Seasonal)..."
            value={filters.search}
            onChange={e => onFilterChange({ search: e.target.value, page: 1 })}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button variant="primary" size="md" leftIcon={<Plus size={16} />} onClick={onOpenCreate}>
            New Live Event
          </Button>
        </div>
      </div>

      {/* Filter Chips & Dropdowns Row */}
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
            let borderColor = isSelected ? 'var(--fc-volt)' : 'var(--border-subtle)';
            let bg = isSelected ? 'rgba(0, 255, 135, 0.15)' : 'var(--bg-secondary)';
            let color = isSelected ? 'var(--fc-volt)' : 'var(--text-secondary)';

            if (opt.isWarning) {
              borderColor = isSelected ? 'var(--fc-crimson)' : 'rgba(255,51,102,0.4)';
              bg = isSelected ? 'rgba(255,51,102,0.2)' : 'rgba(255,51,102,0.08)';
              color = 'var(--fc-crimson)';
            }

            return (
              <button
                key={opt.value}
                onClick={() => onFilterChange({ status: opt.value, page: 1 })}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor,
                  background: bg,
                  color,
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {opt.isWarning && <AlertTriangle size={11} />}
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Category & Sorting Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category Dropdown */}
          <select
            className="input-field select-field"
            value={filters.category}
            onChange={e => onFilterChange({ category: e.target.value, page: 1 })}
            style={{ width: 'auto', minWidth: '150px', padding: '0.35rem 1.8rem 0.35rem 0.65rem', fontSize: '0.75rem' }}
          >
            {categoryOptions.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            className="input-field select-field"
            value={filters.sort}
            onChange={e => {
              const opt = sortOptions.find(s => s.value === e.target.value);
              onFilterChange({
                sort: e.target.value,
                order: (opt?.defaultOrder as any) || 'asc',
                page: 1,
              });
            }}
            style={{ width: 'auto', minWidth: '160px', padding: '0.35rem 1.8rem 0.35rem 0.65rem', fontSize: '0.75rem' }}
          >
            {sortOptions.map(s => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>

          {/* Asc/Desc toggle */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onFilterChange({ order: filters.order === 'asc' ? 'desc' : 'asc', page: 1 })}
            title={`Sort ${filters.order === 'asc' ? 'Descending' : 'Ascending'}`}
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <ArrowUpDown size={14} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{filters.order}</span>
          </button>
        </div>
      </div>

      {/* Pagination & Count Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.5rem',
        }}
      >
        <div>
          Showing {totalFilteredCount} matching campaigns{' '}
          {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage <= 1}
              onClick={() => onFilterChange({ page: currentPage - 1 })}
              style={{ padding: '0.2rem 0.45rem' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', padding: '0 4px' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => onFilterChange({ page: currentPage + 1 })}
              style={{ padding: '0.2rem 0.45rem' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
