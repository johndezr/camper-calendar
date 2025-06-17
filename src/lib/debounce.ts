export function debounce(func: (...args: any[]) => any, wait: number): (...args: any[]) => void {
  let timeout: any = null;

  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
