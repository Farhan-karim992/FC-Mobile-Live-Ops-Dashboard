import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { LiveEvent, EventFilterState } from '../../types';
import { eventService } from '../../services/eventService';
import { useDebounce } from '../../hooks/useDebounce';
import { useLiveOps } from '../../context/LiveOpsContext';
import { EventCard } from './EventCard';
import { EventFilterBar } from './EventFilterBar';
import { EventDetailModal } from './EventDetailModal';
import { CreateEventModal } from './CreateEventModal';
import { Skeleton } from '../common/Skeleton';
import { EmptyState, ErrorState } from '../common/EmptyState';
import { Button } from '../common/Button';

export const EventsView: React.FC = () => {
  const { addToast } = useLiveOps();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<EventFilterState>({
    search: '',
    status: 'ALL',
    type: 'ALL',
    sort: 'endDate',
    order: 'asc',
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventService.getEvents({
        ...filters,
        search: debouncedSearch,
      });
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
  }, [debouncedSearch, filters.status, filters.type, filters.sort, filters.order]);

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
          'Event Status Changed',
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
      addToast('success', 'Event Launched', `"${res.data.title}" is now live!`);
    }
  };

  return (
    <div>
      {/* Title & Refresh header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Live Events Hub</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Monitor real-time event countdowns, adjust active schedules, and inspect squad requirements.
          </p>
        </div>

        <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />} onClick={fetchEvents}>
          Refresh Events
        </Button>
      </div>

      {/* Filter Bar */}
      <EventFilterBar
        filters={filters}
        onFilterChange={updates => setFilters(prev => ({ ...prev, ...updates }))}
        onOpenCreate={() => setIsCreateOpen(true)}
        totalCount={events.length}
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
      ) : events.length === 0 ? (
        <EmptyState
          title="No live events found matching your criteria"
          description="Adjust your search keywords, event category filter, or status toggles to view more campaigns."
          actionText="Clear All Filters"
          onAction={() => setFilters({
            search: '',
            status: 'ALL',
            type: 'ALL',
            sort: 'endDate',
            order: 'asc',
          })}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={setSelectedEvent}
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
        onToggleStatus={handleToggleStatus}
        onExtend={handleExtend}
        onDelete={handleDelete}
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
