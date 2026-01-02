import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputGroupVariants = cva(
  'relative flex min-w-0 items-stretch rounded-md focus-within:z-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
  {
    variants: {
      size: {
        default: 'h-10',
        sm: 'h-9',
        lg: 'h-11',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof inputGroupVariants>
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(inputGroupVariants({ size }), className)}
    {...props}
  />
));
InputGroup.displayName = 'InputGroup';

const inputGroupAddonVariants = cva(
  'flex shrink-0 items-center justify-center rounded-md border border-input text-sm',
  {
    variants: {
      align: {
        'inline-start':
          '-mr-px rounded-e-none border-e-0 [&:has(+[data-slot=input-group-control])]:-mr-px',
        'inline-end':
          '-ml-px rounded-s-none border-s-0 [&:has([data-slot=input-group-control]+&)]:-ml-px',
        'block-start':
          '-mb-px rounded-b-none border-b-0 [&:has(+[data-slot=input-group-control])]:-mb-px',
        'block-end':
          '-mt-px rounded-t-none border-t-0 [&:has([data-slot=input-group-control]+&)]:-mt-px',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
);

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof inputGroupAddonVariants>
>(({ className, align, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(inputGroupAddonVariants({ align }), className)}
    {...props}
  />
));
InputGroupAddon.displayName = 'InputGroupAddon';

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('px-3', className)} {...props} />
));
InputGroupText.displayName = 'InputGroupText';

const inputGroupButtonVariants = cva(
  'z-10 flex shrink-0 items-center justify-center focus:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-8 min-w-8 rounded-md px-2.5 text-xs',
        'icon-xs': 'size-8 rounded-md',
        sm: 'h-9 min-w-9 rounded-md px-3 text-sm',
        'icon-sm': 'size-9 rounded-md',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
);

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof inputGroupButtonVariants>
>(({ className, size, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
});

InputGroupButton.displayName = 'InputGroupButton';

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    data-slot="input-group-control"
    ref={ref}
    className={cn(
      'w-full min-w-0 flex-1 rounded-md border-0 bg-transparent px-3 text-base transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none',
      className
    )}
    {...props}
  />
));
InputGroupInput.displayName = 'InputGroupInput';

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    data-slot="input-group-control"
    ref={ref}
    className={cn(
      'w-full min-w-0 flex-1 resize-none rounded-md border-0 bg-transparent px-3 py-2 text-base transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none',
      className
    )}
    {...props}
  />
));
InputGroupTextarea.displayName = 'InputGroupTextarea';

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
