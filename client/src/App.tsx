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
import { DevToolsInspectorPanel } from './components/performance/DevToolsInspectorPanel';
import { InterviewGuideView } from './components/interview/InterviewGuideView';
import { Modal } from './components/common/Modal';

const DashboardContent: React.FC = () => {
  const { activeTab, devToolsOpen, setDevToolsOpen, devToolsSettings } = useLiveOps();

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
      case 'performance':
        return <DevToolsInspectorPanel />;
      case 'interview':
        return <InterviewGuideView />;
      default:
        return <LiveOpsOverview />;
    }
  };

  // Device frame class logic for mobile emulation
  const getDeviceFrameClass = () => {
    switch (devToolsSettings.deviceViewport) {
      case 'iphone':
        return 'device-frame-iphone';
      case 'pixel':
        return 'device-frame-pixel';
      case 'ipad':
        return 'device-frame-ipad';
      default:
        return '';
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Workspace Column */}
      <div className="main-content">
        <Header />

        <main className={`content-body ${devToolsSettings.deviceViewport !== 'native' ? 'device-frame-container' : ''}`}>
          <div className={getDeviceFrameClass()} style={{ width: '100%' }}>
            {renderActiveTab()}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav />
      </div>

      {/* Floating DevTools Modal / Drawer */}
      <Modal
        isOpen={devToolsOpen}
        onClose={() => setDevToolsOpen(false)}
        title="Chrome DevTools & Performance Profiler"
        subtitle="Live inspection HUD, network chaos simulation, and device viewport emulation"
        maxWidth="820px"
      >
        <DevToolsInspectorPanel />
      </Modal>

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

