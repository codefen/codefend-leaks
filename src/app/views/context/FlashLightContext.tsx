import {
  type PropsWithChildren,
  type RefObject,
  createContext,
  useContext,
  useRef,
} from 'react';

export type FlashLight = {
  isActive: boolean;
  rightPaneRef: RefObject<HTMLDivElement | null> | null;
};

const FlashLightContext = createContext({} as FlashLight);

export const useFlashlight = () => {
  const context = useContext(FlashLightContext);
  return { isActive: context.isActive, rightPaneRef: context.rightPaneRef };
};

// Simplified FlashLightProvider without complex hook dependencies
export const FlashLightProvider = ({ children }: PropsWithChildren) => {
  const rightPaneRef = useRef<HTMLDivElement>(null);

  return (
    <FlashLightContext.Provider
      value={{
        isActive: false,
        rightPaneRef,
      }}>
      {children}
    </FlashLightContext.Provider>
  );
};
