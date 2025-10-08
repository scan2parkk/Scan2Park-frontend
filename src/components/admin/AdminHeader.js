"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import MaxWidthContainer from "../MaxWidthContainer";

function AdminHeader() {
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
        if (decoded.role === "admin") {
          setUserRole(decoded.role);
        } else {
          setUserRole(null);
          router.push("/login");
        }
      } catch (err) {
        setUserRole(null);
        router.push("/login");
      }
    } else {
      setIsLoggedIn(false);
      router.push("/login");
    }
  }, [router]);

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
            <Link href="/admin">
              <img
                src="https://placehold.co/150x40/2980b9/ffffff?text=Scan2Park+Admin"
                alt="Scan2Park Admin Logo"
                className="h-10 rounded-md"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/admin"
                className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/locations"
                className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
              >
                Manage Locations
              </Link>
              <Link
                href="/admin/slots"
                className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
              >
                Manage Slots
              </Link>
              <Link
                href="/admin/bookings"
                className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
              >
                Manage Bookings
              </Link>
              {isLoggedIn && userRole === "admin" && (
                <Link
                  href="/admin/profile"
                  className="text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-base font-medium rounded-md"
                >
                  Profile
                </Link>
              )}
              {/* Right Section - Icons */}
              <div className="flex items-center space-x-4">
                {isLoggedIn && userRole === "admin" ? (
                  <div className="w-[110px] flex justify-end">
                    <Link
                      href="/"
                      className="hover:underline hover:text-[var(--primary)]"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link
                      href="/login"
                      className="hover:underline hover:text-[var(--primary)] mr-2"
                    >
                      Login
                    </Link>
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
              <Link
                href="/admin"
                className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/locations"
                className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
              >
                Manage Locations
              </Link>
              <Link
                href="/admin/slots"
                className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
              >
                Manage Slots
              </Link>
              <Link
                href="/admin/bookings"
                className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
              >
                Manage Bookings
              </Link>
              {isLoggedIn && userRole === "admin" && (
                <Link
                  href="/admin/profile"
                  className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
                >
                  Profile
                </Link>
              )}
              {isLoggedIn && userRole === "admin" ? (
                <div className="w-[110px] flex justify-end">
                  <Link
                    href="/"
                    className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </div>
              ) : (
                <div>
                  <Link
                    href="/login"
                    className="block text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 text-lg font-medium py-2 w-full px-8 rounded-md"
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
        
      </MaxWidthContainer>
    </header>
  );
}

export default AdminHeader;