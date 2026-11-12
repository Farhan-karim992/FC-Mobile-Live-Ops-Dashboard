import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { LiveEvent, EventFilterState } from '../../types';
import { eventService } from '../../services/eventService';
import { useDebounce } from '../../hooks/useDebounce';
import { useLiveOps } from '../../context/LiveOpsContext';
import { EventCard } from './EventCard';
import { EventFilterBar } from './EventFilterBar';
import { EventDetailModal } from './EventDetailModal';
import { CreateEventModal } from './CreateEventModal';
import { EditEventModal } from './EditEventModal';
import { Skeleton } from '../common/Skeleton';
import { EmptyState, ErrorState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { deriveEventStatus } from '../../utils/eventUtils';

export const EventsView: React.FC = () => {
  const { addToast } = useLiveOps();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<EventFilterState>({
    search: '',
    status: 'ALL',
    category: 'ALL',
    sort: 'endDate',
    order: 'asc',
    page: 1,
    pageSize: 8,
  });

  const debouncedSearch = useDebounce(filters.search, 250);

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<LiveEvent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventService.getEvents();
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load live events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Count misconfigured events across dataset
  const misconfiguredCount = useMemo(() => {
    const now = Date.now();
    return events.filter(e => deriveEventStatus(e, now) === 'MISCONFIGURED').length;
  }, [events]);

  // Client-side optimized memoized filtering & sorting (avoiding repeated network trips)
  const filteredEvents = useMemo(() => {
    const now = Date.now();
    let result = [...events];

    // Search query
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q) ||
          e.rewardTier.toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(e => {
        const computed = deriveEventStatus(e, now);
        return computed === filters.status;
      });
    }

    // Category filter
    if (filters.category && filters.category !== 'ALL') {
      result = result.filter(e => {
        const cat = e.category || e.type;
        return cat === filters.category;
      });
    }

    // Sorting
    result.sort((a, b) => {
      const isAsc = filters.order === 'asc';

      if (filters.sort === 'endDate') {
        const aEnd = new Date(a.endDate).getTime();
        const bEnd = new Date(b.endDate).getTime();
        return isAsc ? aEnd - bEnd : bEnd - aEnd;
      }

      if (filters.sort === 'startDate' || filters.sort === 'startDateAsc') {
        const aStart = new Date(a.startDate).getTime();
        const bStart = new Date(b.startDate).getTime();
        return isAsc ? aStart - bStart : bStart - aStart;
      }

      if (filters.sort === 'participants') {
        return isAsc ? a.participantCount - b.participantCount : b.participantCount - a.participantCount;
      }

      if (filters.sort === 'title') {
        return isAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }

      return 0;
    });

    return result;
  }, [events, debouncedSearch, filters.status, filters.category, filters.sort, filters.order]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / filters.pageSize));
  const paginatedEvents = useMemo(() => {
    const startIdx = (filters.page - 1) * filters.pageSize;
    return filteredEvents.slice(startIdx, startIdx + filters.pageSize);
  }, [filteredEvents, filters.page, filters.pageSize]);

  const handleToggleStatus = async (event: LiveEvent) => {
    try {
      const nextStatus = event.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
      const res = await eventService.updateEvent(event.id, { status: nextStatus });
      if (res.success) {
        setEvents(prev => prev.map(e => (e.id === event.id ? res.data : e)));
        if (selectedEvent && selectedEvent.id === event.id) {
          setSelectedEvent(res.data);
        }
        addToast(
          'info',
          'Event Status Modified',
          `Event "${event.title}" is now ${nextStatus}`
        );
      }
    } catch (err: any) {
      addToast('error', 'Status Update Failed', err.message);
    }
  };

  const handleExtend = async (event: LiveEvent) => {
    try {
      const currentEnd = new Date(event.endDate).getTime();
      const extendedEnd = new Date(currentEnd + 24 * 3600 * 1000).toISOString();
      const res = await eventService.updateEvent(event.id, { endDate: extendedEnd });
      if (res.success) {
        setEvents(prev => prev.map(e => (e.id === event.id ? res.data : e)));
        if (selectedEvent && selectedEvent.id === event.id) {
          setSelectedEvent(res.data);
        }
        addToast(
          'success',
          'Event Extended',
          `"${event.title}" extended by 24 hours`
        );
      }
    } catch (err: any) {
      addToast('error', 'Extension Failed', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this live-ops event?')) return;
    try {
      const res = await eventService.deleteEvent(id);
      if (res.success) {
        setEvents(prev => prev.filter(e => e.id !== id));
        if (selectedEvent && selectedEvent.id === id) {
          setSelectedEvent(null);
        }
        addToast('warning', 'Event Removed', 'Event successfully deleted from database');
      }
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    }
  };

  const handleCreateSubmit = async (data: Partial<LiveEvent>) => {
    const res = await eventService.createEvent(data);
    if (res.success) {
      setEvents(prev => [res.data, ...prev]);
      addToast('success', 'Event Launched', `"${res.data.title}" is now active in Live-Ops database!`);
    }
  };

  const handleEditSubmit = async (id: string, updates: Partial<LiveEvent>) => {
    const res = await eventService.updateEvent(id, updates);
    if (res.success) {
      setEvents(prev => prev.map(e => (e.id === id ? res.data : e)));
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent(res.data);
      }
      addToast('success', 'Event Updated', `Changes to "${res.data.title}" saved successfully`);
    }
  };

  return (
    <div>
      {/* Title & Refresh Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Live Events Hub</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Schedule campaigns, edit parameters, monitor dynamic countdowns, and audit configuration health.
          </p>
        </div>

        <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />} onClick={fetchEvents}>
          Refresh Events
        </Button>
      </div>

      {/* Filter Bar with Pagination */}
      <EventFilterBar
        filters={filters}
        onFilterChange={updates => setFilters(prev => ({ ...prev, ...updates }))}
        onOpenCreate={() => setIsCreateOpen(true)}
        totalFilteredCount={filteredEvents.length}
        totalPages={totalPages}
        currentPage={filters.page}
        misconfiguredCount={misconfiguredCount}
      />

      {/* Events Grid / Loading / Error / Empty States */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-panel" style={{ height: '340px', overflow: 'hidden' }}>
              <Skeleton width="100%" height="140px" />
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Skeleton width="75%" height="22px" />
                <Skeleton width="90%" height="16px" />
                <Skeleton width="60%" height="16px" />
                <Skeleton width="100%" height="32px" style={{ marginTop: 'auto' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No live events match your filter criteria"
          description="Adjust your search keywords, event category filter, or status toggles to view more campaigns."
          actionText="Clear All Filters"
          onAction={() => setFilters({
            search: '',
            status: 'ALL',
            category: 'ALL',
            sort: 'endDate',
            order: 'asc',
            page: 1,
            pageSize: 8,
          })}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {paginatedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={setSelectedEvent}
              onEdit={setEditingEvent}
              onToggleStatus={handleToggleStatus}
              onExtend={handleExtend}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={setEditingEvent}
        onToggleStatus={handleToggleStatus}
        onExtend={handleExtend}
        onDelete={handleDelete}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSubmit={handleEditSubmit}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
