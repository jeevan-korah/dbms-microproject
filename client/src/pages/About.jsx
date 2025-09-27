import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function About() {
  const team = [
    {
      name: "Jeevan Biju Korah",
      role: "Backend & Integration",
      bio: "Designed schema and implemented core DB operations.",
      initials: "JK",
    },
    {
      name: "Joyal Jinny",
      role: "Frontend & UX",
      bio: "Built UI flows and ensured responsive design.",
      initials: "JJ",
    },
    {
      name: "Karthik Krishna S",
      role: "Integration & Testing",
      bio: "Connected components, wrote tests and fixed bugs.",
      initials: "KS",
    },
    {
      name: "Judeben Paulose",
      role: "Documentation & Demo",
      bio: "Wrote docs, created the demo dataset and presentation.",
      initials: "JP",
    },
  ];

  const techStack = [
    "React + Vite",
    "JSX",
    "Tailwind CSS",
    "shadcn/ui",
    "MongoDB",
    "Express.js",
    "Node.js",
  ];

  const features = [
    "🔍 Destination Search – Real-time search for favorite destinations",
    "🖼 Image Gallery – Browse destination photos to help decide",
    "🎒 Tour Packages – Compare packages with accommodation and activities",
    "📅 Flexible Booking – Select dates and number of travelers",
    "💳 Secure Payments – Safe online payment processing",
    "⭐ Ratings & Reviews – Share experiences and read traveler feedback",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Travel & Tourism Management System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive MERN stack platform for seamless travel booking,
            destination exploration, and tour management with modern web
            technologies.
          </p>
        </header>

        {/* Features Overview */}
        <section className="mb-16">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Key Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const [title, desc] = feature.split("–"); // split into heading + detail
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition"
                    >
                      {/* <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div> */}
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">
                          {title.trim()}
                        </h4>
                        {desc && (
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {desc.trim()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Project Overview
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                  This Travel and Tourism Management System is built using the
                  MERN stack (MongoDB, Express, React, Node.js) to provide users
                  with a seamless way to explore destinations, choose packages,
                  and book trips with ease. The platform demonstrates modern web
                  development practices with a focus on user experience and
                  scalable architecture.
                </p>

                <Separator className="my-6" />

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Technical Objectives
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Design a normalized and efficient database schema for
                      travel management
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Implement secure data access patterns and transaction
                      handling
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Create a responsive frontend with intuitive user flows
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Integrate payment processing and booking management
                      systems
                    </span>
                  </li>
                </ul>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <a href="#contact">Contact the Team</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  📊 Project Status
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Core functionality complete including database design, API
                  endpoints, and responsive frontend. Ready for testing and
                  deployment.
                </p>
              </CardContent>
            </Card>

            {/* <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  🚀 Getting Started
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Clone and install dependencies:</p>
                  <code className="block bg-gray-100 p-2 rounded text-xs">
                    npm install
                  </code>
                  <p>Start development server:</p>
                  <code className="block bg-gray-100 p-2 rounded text-xs">
                    npm run dev
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    Requires MongoDB connection. See README for setup.
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </aside>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Meet Our Team
            </h2>
            <p className="text-gray-600">
              The dedicated developers who brought this project to life
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card
                key={member.name}
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {member.initials}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  {/* <p className="text-sm text-blue-600 font-medium mb-2">
                    {member.role}
                  </p> */}
                  {/* <p className="text-xs text-gray-600 leading-relaxed">
                    {member.bio}
                  </p> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
            Technical Architecture
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  🗄️ Database Layer
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  MongoDB schema optimized for travel data with indexed fields
                  for fast destination searches and booking queries. Implements
                  transaction safety for critical booking operations.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  🔗 API & Server
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Express.js REST API with structured endpoints for
                  destinations, bookings, and user management. Includes
                  middleware for authentication and data validation.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  🎨 Frontend
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  React with Vite for fast development, styled with Tailwind CSS
                  and shadcn/ui components. Responsive design optimized for
                  mobile and desktop users.
                </p>
              </CardContent>
            </Card>

            {/* <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  🧪 Testing & QA
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Comprehensive testing strategy including unit tests for
                  business logic, integration tests for API endpoints, and
                  manual testing protocols.
                </p>
              </CardContent>
            </Card> */}
          </div>
        </section>

        {/* Contact Footer */}
        <footer
          id="contact"
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Explore or Contribute?
              </h3>
              <p className="text-gray-600">
                Get in touch with our team or check out the project repository
                to start your journey with our travel management platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <a href="mailto:jeevanbijukorah@gmail.com">📧 Email Team</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-200 hover:bg-blue-50"
                asChild
              >
                <a
                  href="https://github.com/jeevan-korah/dbms-microproject"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📁 View Repository
                </a>
              </Button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
