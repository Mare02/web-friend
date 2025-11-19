"use client";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function UserMenu() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [hasMounted, setHasMounted] = useState(false);

  // Prevent hydration mismatch by only showing dynamic content after mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Show loading skeleton during SSR and initial client render
  if (!hasMounted || !isLoaded) {
    return (
      <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
    );
  }

  // Show sign-in button for unauthenticated users
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </SignInButton>
    );
  }

  // Show user menu for authenticated users
  const userName = user.firstName || user.username || "User";
  const userEmail = user.primaryEmailAddress?.emailAddress;
  const userImage = user.imageUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full overflow-hidden p-0"
        >
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userImage}
              alt={userName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            {userEmail && (
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div className="flex">
            <SignOutButton redirectUrl="/">
              <button className="flex w-full items-center gap-2">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

