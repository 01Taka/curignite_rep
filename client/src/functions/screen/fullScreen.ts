export const requestFullScreen = (element: HTMLElement | null) => {
  if (!element) return;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if ((element as any).webkitRequestFullscreen) {
    // Safari
    (element as any).webkitRequestFullscreen();
  } else if ((element as any).mozRequestFullScreen) {
    // Firefox
    (element as any).mozRequestFullScreen();
  } else if ((element as any).msRequestFullscreen) {
    // IE/Edge
    (element as any).msRequestFullscreen();
  }
};

export const exitFullScreen = () => {
  if (
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      // Safari
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      // Firefox
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      (document as any).msExitFullscreen();
    }
  } else {
    console.log("Document is not in fullscreen mode.");
  }
};
