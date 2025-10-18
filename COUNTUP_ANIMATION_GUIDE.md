# Count-Up Animation Implementation Guide

## Overview
Successfully integrated count-up animations inspired by React Bits into the SENU website. Numbers now animate from 0 to their target value when they come into view.

## What Was Added

### 1. CountUp Component (`/src/components/animations/CountUp.tsx`)
A reusable animation component that:
- **Animates numbers** from 0 to target value
- **Triggers on scroll** when element enters viewport
- **Smooth spring animation** using framer-motion
- **Supports suffixes** like "+", "M+", "%", etc.
- **Customizable duration and delay**

#### Props:
- `value` (number): The target number to count up to
- `suffix` (string): Text to append after the number (e.g., "+", "M+", "%")
- `duration` (number): Animation duration in seconds (default: 2)
- `delay` (number): Delay before animation starts in seconds (default: 0)
- `className` (string): Additional CSS classes

### 2. WhatWeDo Section Integration
**File:** `/src/components/landing/WhatWeDo/ServiceCard.tsx`

**Changes:**
- Added count-up animation to project counts (20+, 150+, 40+, 500+)
- Parses strings like "20+" into number (20) and suffix ("+")
- Animates when cards scroll into view
- Duration: 2.5 seconds

**Example:**
```tsx
<CountUp value={20} suffix="+" duration={2.5} />
```

### 3. ImpactSection Integration
**File:** `/src/components/landing/ImpactSection/index.tsx`

**Changes:**
- Added count-up animation to all metrics (70M+, 45%, 620+, 195+)
- Staggered animation delays (0s, 0.15s, 0.3s, 0.45s)
- Creates a cascading effect across the metrics
- Duration: 2.5 seconds per metric

**Example:**
```tsx
<CountUp 
    value={70} 
    suffix="M+" 
    duration={2.5}
    delay={index * 0.15}
/>
```

## How It Works

### Animation Trigger
The component uses **Intersection Observer** via framer-motion's `useInView`:
- Monitors when element enters viewport
- Triggers animation only once (`once: true`)
- 100px margin before triggering for better UX

### Spring Animation
Uses framer-motion's `useSpring` for smooth, natural motion:
- No bounce effect (`bounce: 0`)
- Smooth easing curve
- Numbers increment smoothly, not in jumps

### Number Formatting
- Automatically formats numbers with commas (e.g., 1,000)
- Preserves suffixes like "+", "M+", "%"
- Handles any numeric format

## Usage in Other Components

To use the CountUp animation in other parts of the website:

```tsx
import CountUp from '@/components/animations/CountUp';

// Simple usage
<CountUp value={100} />

// With suffix
<CountUp value={50} suffix="%" />

// With custom duration and delay
<CountUp value={1000} suffix="+" duration={3} delay={0.5} />

// With custom styling
<CountUp 
    value={999} 
    suffix="K+" 
    className="text-4xl font-bold text-blue-500"
/>
```

## Parsing Helper Function

Both components include a helper to parse strings:

```tsx
const parseCount = (count: string) => {
    const match = count.match(/^(\d+)(.*)$/);
    if (match) {
        return { value: parseInt(match[1], 10), suffix: match[2] };
    }
    return { value: 0, suffix: count };
};

// Usage
const { value, suffix } = parseCount("70M+");
// value = 70, suffix = "M+"
```

## Dependencies

The animation uses **framer-motion** which is already installed in the project:
- Version: ^12.23.24
- No additional installation needed
- Fully compatible with Next.js 15

## Performance

- **Lightweight**: Only animates when in viewport
- **One-time animation**: Doesn't re-trigger on scroll
- **GPU accelerated**: Uses transform properties
- **No layout shift**: Numbers maintain space during animation

## Browser Support

Works on all modern browsers that support:
- Intersection Observer API
- CSS transforms
- ES6+ JavaScript

## Customization Tips

### Change Animation Speed
```tsx
<CountUp value={100} duration={1} /> // Faster (1 second)
<CountUp value={100} duration={5} /> // Slower (5 seconds)
```

### Add Delay for Stagger Effect
```tsx
{items.map((item, index) => (
    <CountUp 
        value={item.value} 
        delay={index * 0.2} // 0.2s between each
    />
))}
```

### Custom Number Format
Modify the `display` transform in `CountUp.tsx`:
```tsx
const display = useTransform(spring, (current) => {
    return Math.floor(current).toLocaleString(); // Current: adds commas
    // return Math.floor(current); // Remove commas
    // return current.toFixed(2); // Show decimals
});
```

## Testing

To see the animations:
1. Run `npm run dev`
2. Navigate to the homepage
3. Scroll to "What We Do" section - watch project counts animate
4. Scroll to "Our Impact" section - watch metrics animate with stagger

## Future Enhancements

Possible improvements:
- Add easing options (ease-in, ease-out, etc.)
- Support for decimal numbers
- Custom number formatters
- Pause/resume on hover
- Sound effects on count completion
