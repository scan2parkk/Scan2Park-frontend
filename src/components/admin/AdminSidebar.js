"use client";

import { useState, useEffect } from "react";
import { Home, Users, MapPin, ParkingCircle, BookOpen, User, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import MaxWidthContainer from "../MaxWidthContainer";

function AdminSidebar() {
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

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/locations", label: "Manage Locations", icon: MapPin },
    { href: "/admin/slots", label: "Manage Slots", icon: ParkingCircle },
    { href: "/admin/bookings", label: "Manage Bookings", icon: BookOpen },
    { href: "/admin/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-gray-700 hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:ring-opacity-50 rounded-full transition-colors duration-200"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        {/* <MaxWidthContainer> */}
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-4 border-b border-gray-200">
              <Link href="/admin">
                <img
                  src="https://placehold.co/150x40/2980b9/ffffff?text=Scan2Park+Admin"
                  alt="Scan2Park Admin Logo"
                  className="h-10 w-full bg-[var(--primary)] rounded-md"
                />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 bg-[var(--primary)] text-white">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-white hover:text-[var(--primary)] hover:bg-gray-100 transition-colors duration-200 text-base font-medium"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              ))}
              {isLoggedIn && userRole === "admin" ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-white hover:text-[var(--primary)] hover:bg-gray-100 transition-colors duration-200 text-base font-medium w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center px-4 py-2 text-white hover:text-[var(--primary)] hover:bg-gray-100 transition-colors duration-200 text-base font-medium"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Login
                </Link>
              )}
            </nav>
          </div>
        {/* </MaxWidthContainer> */}
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}

     
    </>
  );
}

export default AdminSidebar;