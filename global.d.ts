interface Window {
  ethereum?: {
    request: (...args: any[]) => Promise<any>;
    on: (eventName: string, handler: (...args: any[]) => void) => void;
    removeListener: (
      eventName: string,
      handler: (...args: any[]) => void,
    ) => void;
  };
}
