import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Leaf, LogOut, LayoutDashboard, ShoppingCart, Globe, DollarSign } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Cart } from '../Cart';
import { useAppStore, Currency, Language } from '@/stores/appStore';
import { ThemeToggle } from '../ThemeToggle';
import { Separator } from '@/components/ui/separator';
const navLinks = [
  { to: '/', label: 'Marketplace' },
  { to: '/education', label: 'Education Hub' }
];
const currencies: Currency[] = ['USD', 'NGN', 'VND'];
const languages: Language[] = ['English', 'Hausa', 'Yoruba', 'Igbo', 'Vietnamese'];
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const cart = useUserStore((s) => s.cart);
  const currency = useAppStore((s) => s.currency);
  const setCurrency = useAppStore((s) => s.setCurrency);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const commonLinkClasses = "transition-colors hover:text-primary";
  const activeLinkClasses = "text-primary font-semibold";
  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Profile</span></Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-display text-primary">DAN</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${commonLinkClasses} ${isActive ? activeLinkClasses : 'text-muted-foreground'}`
                }>
                {link.label}
              </NavLink>
            ))}
            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><DollarSign className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Currency</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                    {currencies.map((c) => <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>)}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><Globe className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Language</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
                    {languages.map((l) => <DropdownMenuRadioItem key={l} value={l}>{l}</DropdownMenuRadioItem>)}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{cart.length}</Badge>
                )}
              </Button>
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px]">
                <div className="flex flex-col p-4">
                  <Link to="/" className="flex items-center gap-2 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                    <Leaf className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold font-display text-primary">DAN</span>
                  </Link>
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `text-lg ${commonLinkClasses} ${isActive ? activeLinkClasses : 'text-muted-foreground'}`
                        }>
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Currency</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">{currency}</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                          {currencies.map((c) => <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>)}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Language</span>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-[110px] justify-start">
                          <span className="truncate">{language}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
                          {languages.map((l) => <DropdownMenuRadioItem key={l} value={l}>{l}</DropdownMenuRadioItem>)}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-8 flex flex-col gap-2">
                    {user ? (
                      <>
                        <Button variant="ghost" asChild>
                          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                        </Button>
                        <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Log Out</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" asChild>
                          <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                        </Button>
                        <Button asChild>
                          <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <Cart open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}