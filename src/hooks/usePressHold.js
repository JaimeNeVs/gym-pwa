import { useEffect, useRef } from "react";

export default function usePressHold(
  onChange,
  {
    initialDelay = 400,
    repeatInterval = 140,
    fastAfter = 1200,
    fastInterval = 65,
  } = {}
) {
  const delayTimeoutRef = useRef(null);
  const repeatIntervalRef = useRef(null);
  const fastTimeoutRef = useRef(null);
  const pressedRef = useRef(false);
  const hasRepeatedRef = useRef(false);

  const callbackRef = useRef(onChange);

  useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);

  function clearTimers() {
    window.clearTimeout(delayTimeoutRef.current);
    window.clearTimeout(fastTimeoutRef.current);
    window.clearInterval(repeatIntervalRef.current);

    delayTimeoutRef.current = null;
    fastTimeoutRef.current = null;
    repeatIntervalRef.current = null;
  }

  function startRepeating(interval) {
    window.clearInterval(repeatIntervalRef.current);

    repeatIntervalRef.current = window.setInterval(() => {
      if (!pressedRef.current) return;

      hasRepeatedRef.current = true;
      callbackRef.current();
    }, interval);
  }

  function start(event) {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    event.preventDefault();

    pressedRef.current = true;
    hasRepeatedRef.current = false;

    clearTimers();

    delayTimeoutRef.current = window.setTimeout(() => {
      if (!pressedRef.current) return;

      hasRepeatedRef.current = true;
      callbackRef.current();

      startRepeating(repeatInterval);

      fastTimeoutRef.current = window.setTimeout(() => {
        if (!pressedRef.current) return;

        startRepeating(fastInterval);
      }, fastAfter);
    }, initialDelay);
  }

  function stop() {
    if (!pressedRef.current) return;

    pressedRef.current = false;
    clearTimers();

    if (!hasRepeatedRef.current) {
      callbackRef.current();
    }
  }

  function cancel() {
    pressedRef.current = false;
    clearTimers();
  }

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerCancel: cancel,
    onPointerLeave: cancel,
    onContextMenu: (event) => event.preventDefault(),
  };
}