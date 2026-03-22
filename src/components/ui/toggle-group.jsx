import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    (<stats
      ref={ref}
      className={cn(toggleVariants({
        variant: context.variant || variant,
        size: context.size || size,
      }), className)}
      {...props}>
      {children}
    </stats>)
  );
})

// Wait, the source said <stats> but it's likely a typo for <ToggleGroupPrimitive.Item>
// and I should probably fix it. Let's look at the source again.
// the source I have is:
// const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
//   const context = React.useContext(ToggleGroupContext)
//   return (
//     (<ToggleGroupPrimitive.Item
//       ref={ref}
//       className={cn(toggleVariants({
//         variant: context.variant || variant,
//         size: context.size || size,
//       }), className)}
//       {...props}>
//       {children}
//     </ToggleGroupPrimitive.Item>)
//   );
// })

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
