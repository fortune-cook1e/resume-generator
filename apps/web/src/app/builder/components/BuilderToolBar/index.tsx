import { useBuilderStore } from '@/store/builder';
import { POST_MESSAGES } from 'shared';
import {
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  ClockClockwise,
  CornersIn,
  CornersOut,
  CubeFocus,
} from '@phosphor-icons/react';
import { Button, Dock, DockIcon, Tooltip } from 'ui';

const BuilderToolBar = () => {
  const iframeRef = useBuilderStore((state) => state.iframe.ref);
  const fullScreen = useBuilderStore((state) => state.fullScreen);
  const setFullScreen = useBuilderStore((state) => state.setFullscreen);

  const onZoomIn = () => {
    iframeRef?.contentWindow?.postMessage({ type: POST_MESSAGES.zoomIn }, '*');
  };
  const onZoomOut = () => {
    iframeRef?.contentWindow?.postMessage({ type: POST_MESSAGES.zoomOut }, '*');
  };
  const onCenter = () => {
    iframeRef?.contentWindow?.postMessage(
      { type: POST_MESSAGES.centerView },
      '*',
    );
  };

  const onReset = () => {
    iframeRef?.contentWindow?.postMessage(
      { type: POST_MESSAGES.resetView },
      '*',
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-0 mx-auto py-6 text-center">
      <Dock direction="middle">
        <DockIcon>
          <Tooltip content="Zoom in">
            <Button
              aria-label="zoom in"
              variant="ghost"
              onClick={onZoomIn}
              size="icon"
            >
              <MagnifyingGlassPlus />
            </Button>
          </Tooltip>
        </DockIcon>

        <DockIcon>
          <Tooltip content="zoom out">
            <Button variant="ghost" aria-label="zoom out" onClick={onZoomOut}>
              <MagnifyingGlassMinus />
            </Button>
          </Tooltip>
        </DockIcon>

        <DockIcon>
          <Tooltip content="Center">
            <Button aria-label="center" variant="ghost" onClick={onCenter}>
              <CubeFocus />
            </Button>
          </Tooltip>
        </DockIcon>

        <DockIcon>
          <Tooltip content="Reset">
            <Button
              aria-label="center"
              variant="ghost"
              size="icon"
              onClick={onReset}
            >
              <ClockClockwise />
            </Button>
          </Tooltip>
        </DockIcon>

        <DockIcon>
          <Tooltip content={fullScreen ? 'Exit full screen' : 'Full screen'}>
            <Button
              aria-label={fullScreen ? 'Exit full screen' : 'Full screen'}
              variant="ghost"
              onClick={() => setFullScreen(!fullScreen)}
              size="icon"
            >
              {fullScreen ? <CornersIn /> : <CornersOut />}
            </Button>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
};

export default BuilderToolBar;
