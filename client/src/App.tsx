import React from 'react';
import { LiveOpsProvider, useLiveOps } from './context/LiveOpsContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { LiveOpsOverview } from './components/dashboard/LiveOpsOverview';
import { EventsView } from './components/events/EventsView';
import { PlayerCatalog } from './components/players/PlayerCatalog';
import { StorePacksGrid } from './components/store/StorePacksGrid';
import { OperationsView } from './components/operations/OperationsView';

const DashboardContent: React.FC = () => {
  const { activeTab } = useLiveOps();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <LiveOpsOverview />;
      case 'events':
        return <EventsView />;
      case 'players':
        return <PlayerCatalog />;
      case 'store':
        return <StorePacksGrid />;
      case 'operations':
        return <OperationsView />;
      default:
        return <LiveOpsOverview />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Workspace Column */}
      <div className="main-content">
        <Header />

        <main className="content-body">
          <div style={{ width: '100%' }}>
            {renderActiveTab()}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav />
      </div>

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LiveOpsProvider>
      <DashboardContent />
    </LiveOpsProvider>
  );
};

export default App;
