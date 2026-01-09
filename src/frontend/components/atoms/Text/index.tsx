import { ReactNode } from 'react';
import { tailwindMerge } from '@/libs/tailwindMerge';

export type TextAsType = 'h1' | 'h3' | 'h2' | 'p' | 'span' | 'div';

export type TextVariantType = 'text';

type TextProps = {
  variant?: TextVariantType;
  as?: TextAsType;
  className?: string;
  children?: ReactNode;
};

const variantsStyles: { [key in TextVariantType]: { as: TextAsType; defaultClassName: string } } = {

  text: {
    as: 'p',
    defaultClassName: 'text-size2 font-bold',
  },
};

export const Text = ({ variant = 'text', as: asTag = undefined, className = '', children = undefined }: TextProps) => {
  const currentVariant = variantsStyles[variant] || variantsStyles.text;

  const Tag = asTag || currentVariant.as;
  const classes = currentVariant.defaultClassName;

  return <Tag className={tailwindMerge(classes, className)}>{children}</Tag>;
};
