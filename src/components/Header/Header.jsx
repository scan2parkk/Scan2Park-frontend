"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import MaxWidthContainer from "../MaxWidthContainer";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm relative z-50">
      <MaxWidthContainer>
        <div className="container mx-auto py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {/* Using a placeholder for the logo. Replace with your actual image. */}
            <Link href="/">
              <img
                src="https://placehold.co/150x40/2980b9/ffffff?text=Scan2Park"
                alt="Scan2Park Logo"
                className="h-10 rounded-md"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
              >
                Home
              </a>
              <a
                href="/parking-locations"
                className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
              >
                Parking Location
              </a>
              <a
                href="/about"
                className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
              >
                About Us
              </a>
              {isLoggedIn && (
                <a
                  href={"/profile"}
                  className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
                >
                  Profile
                </a>
              )}
              {/* Right Section - Icons */}
              <div className={`flex items-center space-x-4`}>
                {isLoggedIn ? (
                  <div className="w-[110px] flex justify-end">
                    <a
                      href="/"
                      className="hover:underline hover:text-[var(--primary)]"
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </div>
                ) : (
                  <div>
                    <a
                      href="/login"
                      className="hover:underline hover:text-[var(--primary)] mr-2"
                    >
                      Login
                    </a>
                    /
                    <a
                      href="/register"
                      className="hover:underline hover:text-[var(--primary)] ml-2"
                    >
                      Signup
                    </a>
                  </div>
                )}
              </div>
            </nav>
            {/* Mobile Menu Button (Hamburger/Close Icon) */}
            <button
              className="md:hidden block p-2 text-gray-700 hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:ring-opacity-50 rounded-full transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 border-t border-gray-200 animate-slide-down">
            <nav className="flex flex-col items-start space-y-4">
              <a
                href="/"
                className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
              >
                Home
              </a>
              <a
                href="/parking-locations"
                className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
              >
                Parking Location
              </a>
              <a
                href="/about"
                className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
              >
                About Us
              </a>
              {isLoggedIn && (
                <a
                  href={"/profile"}
                  className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
                >
                  Profile
                </a>
              )}
              {isLoggedIn ? (
                <div className="w-[110px] flex justify-end">
                  <a
                    href="/"
                    className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </div>
              ) : (
                <div>
                  <a
                    href="/login"
                    className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
                  >
                    Login
                  </a>
                  /
                  <a
                    href="/register"
                    className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
                  >
                    Signup
                  </a>
                </div>
              )}
            </nav>
          </div>
        )}

        {/* Tailwind Custom Animation for mobile menu (add to your global CSS or tailwind.config.js) */}
        <style jsx global>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-down {
            animation: slideDown 0.3s ease-out forwards;
          }
        `}</style>
      </MaxWidthContainer>
    </header>
  );
}

export default Header;
