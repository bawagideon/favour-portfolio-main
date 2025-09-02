"use client"

/**
 * @desc The 'useBreakpoint()' hook is used to get the current
 *       screen breakpoint based on the TailwindCSS config.
 *
 * @usage
 *    import useBreakpoint from "@/hooks/useBreakpoint";
 *
 *    const { isAboveSm, isBelowSm, sm } = useBreakpoint("sm");
 *    const { isAboveMd } = useBreakpoint("md");
 *    const { isAboveLg } = useBreakpoint("lg");
 *    const { isAbove2Xl } = useBreakpoint("2xl");
 */

import { useEffect, useState } from "react"
import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "../../tailwind.config.ts"

const fullConfig = resolveConfig(tailwindConfig)

const breakpoints = fullConfig?.theme?.screens || {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

export default function useBreakpoint<K extends string>(breakpointKey: K) {
  const breakpointValue = breakpoints[breakpointKey as keyof typeof breakpoints]

  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (!breakpointValue) return

    const mediaQuery = window.matchMedia(`(min-width: ${breakpointValue})`)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    // Initial value
    setMatches(mediaQuery.matches)

    // Listen for changes
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [breakpointValue])

  const capitalizedKey =
    breakpointKey[0].toUpperCase() + breakpointKey.substring(1)

  type KeyAbove = `isAbove${Capitalize<K>}`
  type KeyBelow = `isBelow${Capitalize<K>}`

  return {
    [breakpointKey]: Number(String(breakpointValue).replace(/[^0-9]/g, "")),
    [`isAbove${capitalizedKey}`]: matches,
    [`isBelow${capitalizedKey}`]: !matches,
  } as Record<K, number> & Record<KeyAbove | KeyBelow, boolean>
}
