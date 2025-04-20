import { ReactNode } from 'react';
import { tailwindMerge } from '@/libs/tailwindMerge';

export type TextAsType = 'h1' | 'h3' | 'h2' | 'p' | 'span' | 'div';

export type TextVariantType = 'title3' | 'title2' | 'text';

type TextProps = {
  variant?: TextVariantType;
  as?: TextAsType;
  className?: string;
  children?: ReactNode;
};

const variantsStyles: { [key in TextVariantType]: { as: TextAsType; defaultClassName: string } } = {
  title2: {
    as: 'h2',
    defaultClassName: 'text-2xl text-normal text-textNormal',
  },
  title3: {
    as: 'h3',
    defaultClassName: 'text-xl font-bold',
  },

  text: {
    as: 'p',
    defaultClassName: 'text-base font-bold',
  },
};

export const Text = ({ variant = 'text', as: asTag = undefined, className = '', children = undefined }: TextProps) => {
  const currentVariant = variantsStyles[variant] || variantsStyles.text;

  const Tag = asTag || currentVariant.as;
  const classes = currentVariant.defaultClassName;

  return <Tag className={tailwindMerge(classes, className)}>{children}</Tag>;
};
