import { ButtonHTMLAttributes } from 'react';
import { handleClickSound, handleHoverSound } from '@/components/organisms/ButtonSound/sound';
import { tailwindMerge } from '@/libs/tailwindMerge';

export const ButtonWithSound = ({
  onClick,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { onClick: () => void }) => {
  const handleMouseEnter = () => {
    handleHoverSound();
  };

  const handleClick = () => {
    onClick();
    handleClickSound();
  };

  return (
    <button
      className={tailwindMerge(className, 'transition-all duration-150')}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      {...props}
    />
  );
};
