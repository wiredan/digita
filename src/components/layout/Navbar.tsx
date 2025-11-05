import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Leaf } from 'lucide-react';
const navLinks = [
  { to: '/', label: 'Marketplace' },
  { to: '/education', label: 'Education Hub' },
];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const commonLinkClasses = "transition-colors hover:text-primary";
  const activeLinkClasses = "text-primary font-semibold";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-display text-primary">Verdant</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${commonLinkClasses} ${isActive ? activeLinkClasses : 'text-muted-foreground'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Sign Up</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px]">
                <div className="flex flex-col p-4">
                  <Link to="/" className="flex items-center gap-2 mb-8" onClick={() => setIsOpen(false)}>
                    <Leaf className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold font-display text-primary">Verdant</span>
                  </Link>
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `text-lg ${commonLinkClasses} ${isActive ? activeLinkClasses : 'text-muted-foreground'}`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>
                  <div className="mt-8 flex flex-col gap-2">
                    <Button variant="ghost" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Log In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}