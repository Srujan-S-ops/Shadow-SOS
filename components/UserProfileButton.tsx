"use client";
import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function UserProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // When opened, try extracting metadata from auth
    if (isOpen) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserProfile({
          name: currentUser.displayName || "Unknown User",
          email: currentUser.email || "No email linked",
          phone: currentUser.phoneNumber || "+91 XXXXXXXXXX",
          // Mock age since Firebase auth doesn't store age natively
          age: "24",
        });
      } else {
        // Fallback or Mock
        setUserProfile({
          name: "Guest User",
          email: "guest@example.com",
          phone: "+91 9999999999",
          age: "Unknown",
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 transition text-neutral-300"
        title="User Profile"
      >
        <User className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-64 bg-neutral-900 border border-neutral-700/50 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-lg font-bold text-white mb-4">User Profile</h3>
            {userProfile ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-neutral-500 text-xs uppercase tracking-wider block mb-1">Name</span>
                  <span className="text-neutral-200 font-medium">{userProfile.name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-xs uppercase tracking-wider block mb-1">Age</span>
                  <span className="text-neutral-200 font-medium">{userProfile.age}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-xs uppercase tracking-wider block mb-1">Email</span>
                  <span className="text-neutral-200 font-medium truncate block">{userProfile.email}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-xs uppercase tracking-wider block mb-1">Phone</span>
                  <span className="text-neutral-200 font-medium">{userProfile.phone}</span>
                </div>
              </div>
            ) : (
              <p className="text-neutral-400 text-sm">Loading...</p>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white font-medium transition text-xs uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}
