// Debugging version of TextInputPanel input handling without performance monitoring
// This can be used to test if performance monitoring is causing the input issues

const simpleHandleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const newValue = e.target.value;
  
  // Simple onChange without performance tracking
  if (onChange.length > 1) {
    (onChange as (value: string, isPasteAction?: boolean) => void)(newValue, isPasteInProgress);
  } else {
    onChange(newValue);
  }
}, [onChange, isPasteInProgress]);

// Replace line 320 in TextInputPanel.tsx with:
// onChange={simpleHandleInputChange}

// If this fixes the input issue, then the problem is in the performance monitoring system.
// If this doesn't fix it, the issue is elsewhere (possibly in the onChange prop being passed down).
