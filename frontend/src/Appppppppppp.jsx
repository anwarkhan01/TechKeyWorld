import React, {useState, useMemo, useEffect} from "react";
import {
  Search,
  Zap,
  Sparkles,
  Lock,
  Download,
  TrendingUp,
  Eye,
  ArrowRight,
  Award,
  Moon,
  Sun,
} from "lucide-react";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [cursorPos, setCursorPos] = useState({x: 0, y: 0});
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({x: e.clientX, y: e.clientY});
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const products = [
    {
      sku: "WIN11-PRO-001",
      name: "Windows 11 Pro",
      category: "OS",
      platform: "Windows",
      publisher: "Microsoft",
      licenseType: "Lifetime",
      deviceLimit: 1,
      mrp: 8999,
      price: 7499,
      description: "Full version of Windows 11 Pro with advanced features.",
      features: ["BitLocker", "Remote Desktop", "Hyper-V"],
      stock: 150,
      trend: "+12%",
      color: "from-blue-500 to-cyan-400",
    },
    {
      sku: "WIN11-HOME-001",
      name: "Windows 11 Home",
      category: "OS",
      platform: "Windows",
      publisher: "Microsoft",
      licenseType: "Lifetime",
      deviceLimit: 1,
      mrp: 5999,
      price: 5599,
      description: "Windows 11 Home edition for consumers.",
      features: ["Secure Boot", "Modern UI", "Microsoft Store"],
      stock: 120,
      trend: "+8%",
      color: "from-blue-400 to-indigo-400",
    },
    {
      sku: "MAC-OS-SONOMA",
      name: "macOS Sonoma",
      category: "OS",
      platform: "Mac",
      publisher: "Apple",
      licenseType: "Lifetime",
      deviceLimit: 1,
      mrp: 7499,
      price: 5999,
      description: "Advanced macOS for productivity and creativity.",
      features: ["Game Mode", "Enhanced Widgets", "Safari Profiles"],
      stock: 45,
      trend: "+15%",
      color: "from-purple-500 to-pink-400",
    },
    {
      sku: "NOR-NORTON-360",
      name: "Norton 360 Deluxe",
      category: "Security",
      platform: "Windows",
      publisher: "Norton",
      licenseType: "1 Year",
      deviceLimit: 3,
      mrp: 2999,
      price: 2499,
      description: "Complete protection for devices and online privacy.",
      features: ["VPN", "Cloud Backup", "Password Manager"],
      stock: 100,
      trend: "+20%",
      color: "from-yellow-400 to-orange-400",
    },
    {
      sku: "KASPER-TOTAL-SEC",
      name: "Kaspersky Total Security",
      category: "Security",
      platform: "Windows",
      publisher: "Kaspersky",
      licenseType: "1 Year",
      deviceLimit: 3,
      mrp: 3499,
      price: 2999,
      description: "Complete antivirus with parental controls.",
      features: ["Password Manager", "Safe Money", "VPN"],
      stock: 90,
      trend: "+18%",
      color: "from-green-500 to-emerald-400",
    },
    {
      sku: "MS-OFFICE-365",
      name: "Office 365 Personal",
      category: "Productivity",
      platform: "Windows/Mac",
      publisher: "Microsoft",
      licenseType: "1 Year",
      deviceLimit: 1,
      mrp: 4999,
      price: 4599,
      description: "Cloud-enabled Office apps with storage.",
      features: ["Word", "Excel", "PowerPoint", "OneDrive 1TB"],
      stock: 50,
      trend: "+25%",
      color: "from-red-500 to-orange-400",
    },
    {
      sku: "MS-OFFICE-HOME",
      name: "Office 2021 Home & Student",
      category: "Productivity",
      platform: "Windows/Mac",
      publisher: "Microsoft",
      licenseType: "Lifetime",
      deviceLimit: 1,
      mrp: 8999,
      price: 7999,
      description: "One-time purchase of Office 2021 for home users.",
      features: ["Word", "Excel", "PowerPoint"],
      stock: 70,
      trend: "+10%",
      color: "from-orange-500 to-red-400",
    },
    {
      sku: "ADOBE-CC-2025",
      name: "Adobe Creative Cloud",
      category: "Creative",
      platform: "Windows/Mac",
      publisher: "Adobe",
      licenseType: "Monthly",
      deviceLimit: 1,
      mrp: 3299,
      price: 2999,
      description: "Full suite of Adobe creative apps.",
      features: ["Photoshop", "Illustrator", "Premiere Pro"],
      stock: 90,
      trend: "+30%",
      color: "from-pink-500 to-purple-400",
    },
    {
      sku: "EXPRESSVPN-PRO",
      name: "ExpressVPN",
      category: "Privacy",
      platform: "Windows/Mac",
      publisher: "ExpressVPN",
      licenseType: "1 Year",
      deviceLimit: 5,
      mrp: 7999,
      price: 6999,
      description: "Secure VPN with high-speed servers.",
      features: ["Kill Switch", "Private DNS", "AES-256"],
      stock: 100,
      trend: "+22%",
      color: "from-teal-500 to-cyan-400",
    },
  ];

  const categories = [
    {
      name: "OS",
      label: "Operating Systems",
      emoji: "💻",
      bgColor: isDark ? "bg-blue-500/10" : "bg-blue-50",
      borderColor: isDark ? "border-blue-500/20" : "border-blue-200",
    },
    {
      name: "Security",
      label: "Security Suite",
      emoji: "🛡️",
      bgColor: isDark ? "bg-green-500/10" : "bg-green-50",
      borderColor: isDark ? "border-green-500/20" : "border-green-200",
    },
    {
      name: "Productivity",
      label: "Productivity",
      emoji: "📊",
      bgColor: isDark ? "bg-orange-500/10" : "bg-orange-50",
      borderColor: isDark ? "border-orange-500/20" : "border-orange-200",
    },
    {
      name: "Creative",
      label: "Creative Tools",
      emoji: "🎨",
      bgColor: isDark ? "bg-purple-500/10" : "bg-purple-50",
      borderColor: isDark ? "border-purple-500/20" : "border-purple-200",
    },
    {
      name: "Privacy",
      label: "Privacy & VPN",
      emoji: "🔒",
      bgColor: isDark ? "bg-teal-500/10" : "bg-teal-50",
      borderColor: isDark ? "border-teal-500/20" : "border-teal-200",
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.publisher.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const discount = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-black text-white"
          : "bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"
      } overflow-hidden relative transition-colors duration-300`}
    >
      {/* Animated Background Grid */}
      <div className={`fixed inset-0 ${isDark ? "opacity-20" : "opacity-10"}`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${
              isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(139, 92, 246, 0.15)"
            } 1px, transparent 1px), linear-gradient(90deg, ${
              isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(139, 92, 246, 0.15)"
            } 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Cursor Glow Effect */}
      <div
        className={`fixed w-64 h-64 sm:w-96 sm:h-96 rounded-full pointer-events-none z-50 mix-blend-screen ${
          isDark ? "opacity-30" : "opacity-20"
        } blur-3xl transition-transform duration-300`}
        style={{
          background: `radial-gradient(circle, ${
            isDark ? "rgba(139, 92, 246, 0.6)" : "rgba(139, 92, 246, 0.8)"
          } 0%, transparent 70%)`,
          left: cursorPos.x - (window.innerWidth < 640 ? 128 : 192),
          top: cursorPos.y - (window.innerWidth < 640 ? 128 : 192),
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 backdrop-blur-xl ${
          isDark
            ? "bg-black/50 border-white/10"
            : "bg-white/70 border-purple-200/30"
        } border-b transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-50" />
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 relative text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  KEYFORGE
                </h1>
                <p
                  className={`text-[10px] sm:text-xs ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Digital License Store
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-full ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-purple-100 hover:bg-purple-200"
                } transition`}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                )}
              </button>
              <button
                className={`hidden sm:block px-4 py-2 rounded-full border ${
                  isDark
                    ? "border-white/20 hover:bg-white/10"
                    : "border-purple-300 hover:bg-purple-50"
                } transition text-sm`}
              >
                Login
              </button>
              <button className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-purple-500/50 transition text-xs sm:text-sm font-semibold text-white">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 sm:mb-20">
            <div
              className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full border ${
                isDark
                  ? "border-purple-500/30 bg-purple-500/10"
                  : "border-purple-300 bg-purple-100"
              } mb-4 sm:mb-6`}
            >
              <Sparkles
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <span
                className={`text-xs sm:text-sm ${
                  isDark ? "text-purple-300" : "text-purple-700"
                } font-medium`}
              >
                Instant Digital Delivery
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 leading-tight px-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Unlock Premium
              </span>
              <br />
              <span className={isDark ? "text-white" : "text-gray-900"}>
                Software Licenses
              </span>
            </h2>
            <p
              className={`text-base sm:text-xl ${
                isDark ? "text-gray-400" : "text-gray-700"
              } max-w-2xl mx-auto mb-6 sm:mb-10 px-4`}
            >
              Genuine keys. Lightning fast delivery. Unbeatable prices. Welcome
              to the future of digital licensing.
            </p>

            {/* Unique Search Bar */}
            <div className="max-w-3xl mx-auto relative group px-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition" />
              <div
                className={`relative ${
                  isDark ? "bg-black/80" : "bg-white/90"
                } backdrop-blur-xl rounded-xl sm:rounded-2xl border ${
                  isDark ? "border-white/20" : "border-purple-200"
                } p-2 flex items-center`}
              >
                <Search
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } ml-2 sm:ml-4`}
                />
                <input
                  type="text"
                  placeholder="Search software..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent px-3 sm:px-4 py-3 sm:py-4 ${
                    isDark
                      ? "text-white placeholder-gray-500"
                      : "text-gray-900 placeholder-gray-500"
                  } outline-none text-sm sm:text-lg`}
                />
                <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition text-xs sm:text-base text-white">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Categories - Horizontal Scroll */}
          <div className="mb-8 sm:mb-16">
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-4 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition flex-shrink-0 text-sm sm:text-base ${
                  !selectedCategory
                    ? isDark
                      ? "bg-white text-black border-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent"
                    : isDark
                    ? "bg-white/5 border-white/20 hover:bg-white/10"
                    : "bg-white border-purple-200 hover:bg-purple-50"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition flex items-center space-x-2 flex-shrink-0 text-sm sm:text-base ${
                    selectedCategory === cat.name
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white"
                      : `${cat.bgColor} ${cat.borderColor} ${
                          isDark ? "" : "hover:bg-opacity-80"
                        }`
                  }`}
                >
                  <span className="text-base sm:text-xl">{cat.emoji}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.sku}
                onMouseEnter={() => setHoveredProduct(product.sku)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative"
                style={{animationDelay: `${idx * 100}ms`}}
              >
                {/* Glow Effect on Hover */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${product.color} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition duration-500`}
                />

                <div
                  className={`relative ${
                    isDark
                      ? "bg-gradient-to-br from-white/5 to-white/[0.02]"
                      : "bg-white/80"
                  } backdrop-blur-xl rounded-xl sm:rounded-2xl border ${
                    isDark
                      ? "border-white/10 hover:border-white/30"
                      : "border-purple-200/50 hover:border-purple-300"
                  } overflow-hidden h-full transition duration-500`}
                >
                  {/* Top Section */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r ${product.color} text-white`}
                          >
                            {product.platform}
                          </span>
                          {product.licenseType === "Lifetime" && (
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                          )}
                        </div>
                        <h3
                          className={`text-base sm:text-xl font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          } mb-1 sm:mb-2 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition`}
                        >
                          {product.name}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {product.publisher}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 text-green-500">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-bold">
                          {product.trend}
                        </span>
                      </div>
                    </div>

                    <p
                      className={`text-xs sm:text-sm ${
                        isDark ? "text-gray-400" : "text-gray-700"
                      } mb-3 sm:mb-4 line-clamp-2`}
                    >
                      {product.description}
                    </p>

                    {/* Features Pills */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                      {product.features.slice(0, 2).map((feature, i) => (
                        <div
                          key={i}
                          className={`px-2 sm:px-3 py-1 rounded-full ${
                            isDark
                              ? "bg-white/5 border border-white/10 text-gray-300"
                              : "bg-purple-50 border border-purple-200 text-purple-700"
                          } text-[10px] sm:text-xs`}
                        >
                          {feature}
                        </div>
                      ))}
                      {product.features.length > 2 && (
                        <div
                          className={`px-2 sm:px-3 py-1 rounded-full ${
                            isDark
                              ? "bg-white/5 border border-white/10 text-gray-300"
                              : "bg-purple-50 border border-purple-200 text-purple-700"
                          } text-[10px] sm:text-xs`}
                        >
                          +{product.features.length - 2}
                        </div>
                      )}
                    </div>

                    {/* Price Section */}
                    <div className="flex items-end justify-between mb-4 sm:mb-6">
                      <div>
                        <div className="flex items-baseline space-x-1 sm:space-x-2">
                          <span
                            className={`text-2xl sm:text-3xl font-black ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r ${product.color} text-white`}
                          >
                            -{discount(product.mrp, product.price)}%
                          </span>
                        </div>
                        <span
                          className={`text-xs sm:text-sm ${
                            isDark ? "text-gray-500" : "text-gray-600"
                          } line-through`}
                        >
                          ₹{product.mrp.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold bg-gradient-to-r ${product.color} hover:shadow-lg transition flex items-center justify-center space-x-2 text-white text-sm sm:text-base`}
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Instant Access</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition" />
                    </button>

                    {/* Stock Info */}
                    <div
                      className={`mt-3 sm:mt-4 flex items-center justify-between text-[10px] sm:text-xs ${
                        isDark ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{product.stock} available</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>
                          {product.deviceLimit} device
                          {product.deviceLimit > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-20">
              <div
                className={`inline-block p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
                  isDark
                    ? "bg-white/5 border border-white/10"
                    : "bg-white border border-purple-200"
                } mb-4`}
              >
                <Search
                  className={`w-8 h-8 sm:w-12 sm:h-12 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  } mx-auto`}
                />
              </div>
              <h3
                className={`text-xl sm:text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                No matches found
              </h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Try a different search term or category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`relative border-t ${
          isDark ? "border-white/10" : "border-purple-200"
        } mt-12 sm:mt-20 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h4
                className={`font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-3 sm:mb-4 text-sm sm:text-base`}
              >
                Products
              </h4>
              <ul
                className={`space-y-1 sm:space-y-2 text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Operating Systems
                </li>
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Security Suite
                </li>
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Office Apps
                </li>
              </ul>
            </div>
            <div>
              <h4
                className={`font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-3 sm:mb-4 text-sm sm:text-base`}
              >
                Company
              </h4>
              <ul
                className={`space-y-1 sm:space-y-2 text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  About Us
                </li>
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Contact
                </li>
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Careers
                </li>
              </ul>
            </div>
            <div>
              <h4
                className={`font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-3 sm:mb-4 text-sm sm:text-base`}
              >
                Support
              </h4>
              <ul
                className={`space-y-1 sm:space-y-2 text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Help Center
                </li>
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Activation
                </li>
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Refunds
                </li>
              </ul>
            </div>
            <div>
              <h4
                className={`font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-3 sm:mb-4 text-sm sm:text-base`}
              >
                Legal
              </h4>
              <ul
                className={`space-y-1 sm:space-y-2 text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Privacy
                </li>
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Terms
                </li>
                <li
                  className={`${
                    isDark ? "hover:text-white" : "hover:text-gray-900"
                  } transition cursor-pointer`}
                >
                  Licenses
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`border-t ${
              isDark ? "border-white/10" : "border-purple-200"
            } pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0`}
          >
            <p
              className={`${
                isDark ? "text-gray-500" : "text-gray-600"
              } text-xs sm:text-sm text-center sm:text-left`}
            >
              &copy; 2025 KeyForge. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span
                className={`text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
