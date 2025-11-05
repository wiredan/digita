import { Link } from 'react-router-dom';
import { Leaf, Twitter, Facebook, Instagram } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold font-display text-primary">DAN</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting farmers and agribusiness participants in a secure, decentralized marketplace.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Marketplace</Link></li>
              <li><Link to="/education" className="text-sm text-muted-foreground hover:text-primary">Education Hub</Link></li>
              <li><Link to="/profile" className="text-sm text-muted-foreground hover:text-primary">My Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Help Center</a></li>
              <li><a href="mailto:dansidran@gmail.com" className="text-sm text-muted-foreground hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Dispute Resolution</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} DAN. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="https://twitter.com/wilaya90" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">Built with ❤️ at Cloudflare</p>
      </div>
    </footer>
  );
}