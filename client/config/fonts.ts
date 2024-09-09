import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

import localFont from 'next/font/local'

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
 
// Font files can be colocated inside of `app`
const myFont = localFont({
  src: './cards21.ttf',
  display: 'swap',
})

