import {
    Twitter,
    Facebook,
    Youtube,
    Instagram,
    MessageCircle,
    Music,
    Github,
    Disc as Discord,
    Linkedin,
  } from "lucide-react";
  
  export default function Footer() {
    return (
      <footer className="bg-black text-gray-300 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo and Social Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-white text-2xl font-bold">TradingView</h2>
                <p className="mt-2 text-sm">Look first / Then leap.</p>
              </div>
  
              {/* Social Icons */}
              <div className="grid grid-cols-4 gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Music className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Discord className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
  
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                  <span>English (India)</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
  
            {/* Products Column */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Products</h3>
              <ul className="space-y-2">
                {[
                  "Supercharts",
                  "Pine Script™",
                  "Stock Screener",
                  "ETF Screener",
                  "Bond Screener",
                  "Forex Screener",
                  "Crypto Coins Screener",
                  "Crypto Pairs Screener",
                  "DEX Pairs Screener",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Company Column */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Company</h3>
              <ul className="space-y-2">
                {[
                  "About",
                  "Features",
                  "Pricing",
                  "Social network",
                  "Wall of Love",
                  "Athletes",
                  "Manifesto",
                  "Careers",
                  "Blog",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Community Column */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Community</h3>
              <ul className="space-y-2">
                {[
                  "Refer a friend",
                  "Ideas",
                  "Scripts",
                  "House rules",
                  "Moderators",
                  "Pine Script™ Wizards",
                  "Chat",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* For Business Column */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">For business</h3>
              <ul className="space-y-2">
                {[
                  "Widgets",
                  "Advertising",
                  "Charting libraries",
                  "Lightweight Charts™",
                  "Advanced Charts",
                  "Trading Platform",
                  "Brokerage integration",
                  "Partner program",
                  "Education program",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`text-sm hover:text-white transition-colors ${
                        item === "Advanced Charts" ? "text-blue-400" : ""
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  