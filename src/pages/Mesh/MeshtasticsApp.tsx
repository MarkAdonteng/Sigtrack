import { DeviceWrapper } from "./DeviceWrapper";
import { PageRouter } from "./PageRouter.js";
import { CommandPalette } from "./components/CommandPalette.js";
import DeviceSelectorWithBoundary from "./components/ErrorBoundary.js";
import { DialogManager } from "./components/Dialog/DialogManager.js";
import { NewDeviceDialog } from "./components/Dialog/NewDeviceDialog.js";
import { Toaster } from "./components/Toaster.js";
import { ThemeController } from "./components/generic/ThemeController.js";
import { useAppStore } from "./core/stores/appStore.js";
import { useDeviceStore } from "./core/stores/deviceStore.js";
import { Dashboard } from "./pages/Dashboard/index.js";
import { MapProvider } from "react-map-gl";
import { DeviceSelector } from "./components/DeviceSelector.js";

const MeshtasticApp: React.FC = () => {
  const { getDevice } = useDeviceStore();
  const { selectedDevice, setConnectDialogOpen, connectDialogOpen } = useAppStore();

  const device = getDevice(selectedDevice);

  const handleError = () => {
    // Handle errors as needed
    console.error('An error occurred within MeshtasticApp');
  };

  return (
    <ThemeController>
      <NewDeviceDialog
        open={connectDialogOpen}
        onOpenChange={(open) => {
          setConnectDialogOpen(open);
        }}
      />
      <Toaster />
      <MapProvider>
        <DeviceWrapper device={device}>
          <div className="flex h-screen flex-col overflow-hidden bg-backgroundPrimary text-textPrimary">
            <div className="flex flex-grow">
              {/* Wrap DeviceSelector with the ErrorBoundary */}
              <DeviceSelectorWithBoundary onError={handleError}>
                <DeviceSelector />
              </DeviceSelectorWithBoundary>
              <div className="flex flex-grow flex-col">
                {device ? (
                  <div className="flex h-screen">
                    <DialogManager />
                    <CommandPalette />
                    <PageRouter />
                  </div>
                ) : (
                  <Dashboard />
                )}
              </div>
            </div>
          </div>
        </DeviceWrapper>
      </MapProvider>
    </ThemeController>
  );
};

export default MeshtasticApp;