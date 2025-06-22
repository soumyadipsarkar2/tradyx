"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import Image from "next/image"

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const navbarHeight = 80 // Account for fixed navbar
    const elementPosition = element.offsetTop - navbarHeight
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    })
  }
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const navItems = [
    { name: "Home", href: "home" },
    { name: "About", href: "about" },
    { name: "Mission", href: "mission" },
    { name: "Vision", href: "vision" },
    { name: "Team", href: "team" },
    { name: "Business", href: "business" },
    { name: "Rewards", href: "rewards" },
    { name: "Terms", href: "terms" },
  ]

  const handleScrollToSection = (sectionId: string) => {
    scrollToSection(sectionId)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href)
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-emerald-500/20"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            onClick={() => handleScrollToSection("home")}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Image src="/images/logo.png" alt="TRADY X" width={100} height={100} className="w-25 h-14" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleScrollToSection(item.href)}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  activeSection === item.href ? "text-emerald-400" : "text-gray-300 hover:text-emerald-400"
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
                {activeSection === item.href && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400"
                    initial={false}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Get Started Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
            <Button
              onClick={() => window.open("https://tradyx.pro", "_blank")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-full transition-all duration-300 border border-emerald-500/20"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} whileTap={{ scale: 0.95 }}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleScrollToSection(item.href)}
                className={`block w-full text-left text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.href ? "text-emerald-400" : "text-gray-300 hover:text-emerald-400"
                }`}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.button>
            ))}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
              <Button
                onClick={() => window.open("https://tradyx.pro", "_blank")}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-full transition-all duration-300 border border-emerald-500/20"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

const AnimatedSection = ({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.section
      ref={ref}
      id={id}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        hidden: { opacity: 0, y: 60 },
      }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

const ParallaxImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={1200}
        height={600}
        className="w-full rounded-3xl shadow-2xl"
      />
    </motion.div>
  )
}

const GlowingCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl"
        animate={{
          opacity: isHovered ? 0.8 : 0.3,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export default function TradyXLanding() {
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden relative">
      <Navbar />
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), 
                       radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 40% 80%, rgba(52, 211, 153, 0.05) 0%, transparent 50%)`,
        }}
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), 
             radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 40% 80%, rgba(52, 211, 153, 0.05) 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), 
             radial-gradient(circle at 20% 70%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 60% 20%, rgba(52, 211, 153, 0.05) 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />
              <Image
                src="/images/logo.png"
                alt="TRADY X Logo"
                width={200}
                height={200}
                className="relative z-10 mx-auto mb-8 drop-shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold mb-6 text-white relative"
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 20px rgba(16, 185, 129, 0.5)",
                  "0 0 40px rgba(16, 185, 129, 0.8)",
                  "0 0 20px rgba(16, 185, 129, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              TRADY
            </motion.span>{" "}
            <motion.span
              className="text-emerald-400"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            >
              X
            </motion.span>{" "}
            Pro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-2xl md:text-3xl mb-12 text-gray-300"
          >
            Empowering Your Financial Future
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={() => window.open("https://tradyx.pro", "_blank")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 group border border-emerald-500/20 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                />
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Us */}
      <AnimatedSection id="about" className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/about-us.jpg" alt="About TRADY X" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Mission */}
      <AnimatedSection id="mission" className="py-20 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/mission.jpg" alt="Our Mission" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Vision */}
      <AnimatedSection id="vision" className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/vision.jpg" alt="Our Vision" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Founder */}
      <AnimatedSection id="founder" className="py-20 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/founder.jpg" alt="Founder - Jirolu Saka Tama" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Expert Team */}
      <AnimatedSection id="team" className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/expert-team.jpg" alt="Expert Team" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Crypto Revolution */}
      <AnimatedSection id="crypto" className="py-20 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/crypto-revolution.jpg" alt="Crypto Revolution" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Business Plan */}
      <AnimatedSection id="business" className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/business-plan.jpg" alt="Business Plan" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Types of Bonus */}
      <AnimatedSection id="rewards" className="py-20 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/types-of-bonus.jpg" alt="Types of Bonus" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Trading Profit Bonus */}
      <AnimatedSection id="trading-bonus" className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/trading-profit-bonus.jpg" alt="Trading Profit Bonus" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Direct Bonus */}
      <AnimatedSection id="direct-bonus" className="py-20 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/direct-bonus.jpg" alt="Direct Bonus" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Level Profit Bonus */}
      <AnimatedSection id="level-bonus" className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/level-profit-bonus.jpg" alt="Level Profit Bonus" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* CORE Tier */}
      <AnimatedSection id="tiers" className="py-12 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/core.jpg"
                alt="CORE Tier Rewards"
                width={1200}
                height={600}
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* BRONZE Tier */}
      <AnimatedSection className="py-12 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <motion.div
              whileHover={{ scale: 1.02, rotateY: -5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/bronze.jpg"
                alt="BRONZE Tier Rewards"
                width={1200}
                height={600}
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* SILVER Tier */}
      <AnimatedSection className="py-12 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/silver.jpg"
                alt="SILVER Tier Rewards"
                width={1200}
                height={600}
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* GOLD Tier */}
      <AnimatedSection className="py-12 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <motion.div
              whileHover={{ scale: 1.02, rotateY: -5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/gold.jpg"
                alt="GOLD Tier Rewards"
                width={1200}
                height={600}
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* CROWN Tier */}
      <AnimatedSection className="py-12 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/crown.jpg"
                alt="CROWN Tier Rewards"
                width={1200}
                height={600}
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* EMERALD Tier */}
      <AnimatedSection className="py-12 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <motion.div
              whileHover={{ scale: 1.02, rotateY: -5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/emerald.jpg"
                alt="EMERALD Tier Rewards"
                width={1200}
                height={600}
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* TOPAZ Tier */}
      <AnimatedSection className="py-12 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/topaz.jpg"
                alt="TOPAZ Tier Rewards"
                width={1200}
                height={600}
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Terms & Conditions */}
      <AnimatedSection id="terms" className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <ParallaxImage src="/images/terms-and-conditions.jpg" alt="Terms and Conditions" />
          </GlowingCard>
        </div>
      </AnimatedSection>

      {/* Thank You Section */}
      {/* <AnimatedSection className="py-20 px-4 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <GlowingCard>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/thank-you.jpg"
                alt="Thank You"
                width={1200}
                height={600}
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </GlowingCard>
        </div>
      </AnimatedSection> */}

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900/80 backdrop-blur-sm border-t border-emerald-500/20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-6">
                <Image src="/images/logo.png" alt="TRADY X" width={100} height={80} className="w-25 h-25" />
              </div>
              <p className="text-gray-400">Empowering your financial future through innovative crypto solutions.</p>
            </motion.div>

            {[
              {
                title: "Quick Links",
                links: [
                  { name: "About Us", href: "about" },
                  { name: "Mission", href: "mission" },
                  { name: "Vision", href: "vision" },
                  { name: "Rewards", href: "rewards" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { name: "Terms & Conditions", href: "terms" },
                  { name: "Business Plan", href: "business" },
                  { name: "Expert Team", href: "team" },
                  { name: "Get Started", href: "https://tradyx.pro", external: true },
                ],
              },
              {
                title: "Contact",
                content: (
                  <div className="space-y-2 text-gray-400">
                    <p>support@tradyx.com</p>
                    <p>+1 (555) 123-4567</p>
                    <div className="flex space-x-4 mt-4">
                      {["T", "D", "L"].map((letter, index) => (
                        <motion.div
                          key={letter}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                          className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer"
                        >
                          <span className="text-white text-sm">{letter}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
                {section.links ? (
                  <ul className="space-y-2 text-gray-400">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <motion.button
                          onClick={() => {
                            if (link.external) {
                              window.open(link.href, "_blank")
                            } else {
                              scrollToSection(link.href)
                            }
                          }}
                          className="hover:text-emerald-400 transition-colors text-left"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.name}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  section.content
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="border-t border-emerald-500/20 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400">© 2024 TRADY X. All rights reserved. | Empowering Your Financial Future</p>
          </motion.div>
        </div>
      </footer>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-full shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <ArrowRight className="w-6 h-6 rotate-[-90deg]" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  )
}
