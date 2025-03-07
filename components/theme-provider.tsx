'use client'

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"
import { PropsWithChildren } from 'react';


function ThemeProvider({ children, ...props }: PropsWithChildren<ThemeProviderProps>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
export default ThemeProvider;