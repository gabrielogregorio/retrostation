import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { HTMLAttributes, ReactNode } from 'react';
import { tailwindMerge } from '@/libs/tailwindMerge';

interface RootProps {
  isOpen: boolean;
  className?: string;
  children: ReactNode;
  onClose: () => void;
}

const Root = ({ children, isOpen, onClose, className = '' }: RootProps) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    className={tailwindMerge(
      'fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-lg transition-all duration-75 animate-fadeIn',
      className,
    )}>
    {children}
  </Dialog>
);

const CustomDialogPanel = ({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <DialogPanel
    className={tailwindMerge('space-y-4 border backdrop-blur-lg bg-black/20 rounded-lg border-white/20', className)}
    {...rest}>
    {children}
  </DialogPanel>
);

const CustomTitle = ({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) => (
  <DialogTitle {...rest}>{children}</DialogTitle>
);

const CustomDescription = ({ children, ...rest }: HTMLAttributes<HTMLParagraphElement>) => (
  <Description {...rest}>{children}</Description>
);

const CustomContent = ({ children, ...rest }: HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>;

export const Modal = {
  Root,
  DialogPanel: CustomDialogPanel,
  DialogTitle: CustomTitle,
  Description: CustomDescription,
  Content: CustomContent,
};
