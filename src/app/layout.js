import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "react-hot-toast"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Palette",
  description: "Editable and customizable template generator for websites",
  // image: "/og-image.jpg",
  // url: "https://palette.vercel.app",
  // type: "website",
  // keywords: ["Palette", "Website", "Theme", "Template", "Generator"],
  // site_name: "Palette",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >



        
        <SignedOut>
          <div
            className="flex flex-col justify-center items-center h-screen relative overflow-hidden"
            style={{
              backgroundImage: "url('/sign _in.jpg')", // Replace with your image URL
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Dark Overlay for Better Readability */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
              <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob"></div>
              <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
              <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
            </div>

            {/* Sign In Card */}
            <div className="flex flex-col items-center bg-white/100 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/10 relative z-10 transform transition-all duration-300 hover:scale-105">
              <h1 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-lg">
                Welcome to palette
              </h1>
              <p className="text-gray-800 text-lg font-semibold mb-6 max-w-md text-center">
                Your ultimate platform for creating, customizing, and sharing dynamic website themes with ease.
              </p>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-full shadow-lg transition duration-300 transform hover:scale-105">
                  <span>Sign In To palette</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>  

        <SignedIn>
            <div className="flex justify-between items-center bg-[#070533] text-white p-3">
                <a href="/" className="text-xl font-bold cursor-pointer">Palette</a>
                <UserButton userProfileMode="modal" />
            </div>
            <div>
              {children}
            </div>
        </SignedIn>
        <Toaster/>
      </body>
    </html>
    </ClerkProvider>
  );
}
