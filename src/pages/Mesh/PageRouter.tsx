import { useDevice } from "./core/stores/deviceStore.js";
import { ChannelsPage } from "./pages/Channels.js";
import { ConfigPage } from "./pages/Config/index.js";
import { MapPage } from "./pages/Map.tsx";
import ErrorBoundary from "./pages/MapErroBoundary.js";
import { MessagesPage } from "./pages/Messages.js";
import { PeersPage } from "./pages/Peers.js";

export const PageRouter = (): JSX.Element => {
  const { activePage } = useDevice();
  return (
    <>
      {activePage === "messages" && <MessagesPage />}
      <ErrorBoundary>
      {activePage === "map" && <MapPage />}
      </ErrorBoundary>
      {activePage === "config" && <ConfigPage />}
      {activePage === "channels" && <ChannelsPage />}
      {activePage === "peers" && <PeersPage />}
    </>
  );
};
