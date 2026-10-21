"use client";

import React, { useState } from "react";
import { useToastStore } from "@/lib/store/toastStore";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { showToast } = useToastStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Order Inquiry");
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast("Please fill in all inquiry fields");
      return;
    }
    setTicketId(Math.floor(1000 + Math.random() * 9000).toString());
    setSubmitted(true);
    showToast("Message received! Our team will respond within 4 hours.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent)]/10 px-3 py-1 rounded-full">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Customer &amp; Artisan Care</span>
        </div>
        <h2>Direct Support &amp; Inquiries</h2>
        <p className="sub text-sm max-w-lg mx-auto">
          Need assistance with a bespoke plaque engraving, corporate hamper order, or artisan partnership? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Support Info Cards */}
        <div className="space-y-4 md:col-span-1">
          <div className="panel p-4 space-y-1 text-xs">
            <Mail className="w-4 h-4 text-[var(--accent)] mb-1" />
            <b className="text-[var(--ink)] block">Email Support</b>
            <p className="text-[var(--mut)]">support@craftvilla.lk</p>
            <p className="text-[var(--mut)]">artisans@craftvilla.lk</p>
          </div>

          <div className="panel p-4 space-y-1 text-xs">
            <Phone className="w-4 h-4 text-[var(--ok)] mb-1" />
            <b className="text-[var(--ink)] block">Hotline &amp; WhatsApp</b>
            <p className="text-[var(--mut)]">+94 (11) 284-9020</p>
            <p className="text-[var(--mut)]">+94 (77) 419-8800</p>
          </div>

          <div className="panel p-4 space-y-1 text-xs">
            <Clock className="w-4 h-4 text-[var(--mut)] mb-1" />
            <b className="text-[var(--ink)] block">Hours of Operation</b>
            <p className="text-[var(--mut)]">Mon – Sat: 8:30 AM – 6:30 PM</p>
            <p className="text-[var(--mut)]">Sunday: Closed for workshop rest</p>
          </div>

          <div className="panel p-4 space-y-1 text-xs">
            <MapPin className="w-4 h-4 text-[var(--accent)] mb-1" />
            <b className="text-[var(--ink)] block">Headquarters Studio</b>
            <p className="text-[var(--mut)]">
              45 Queen&apos;s Road, Colombo 03, Sri Lanka
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="panel md:col-span-2 p-6">
          <h3 className="text-lg mb-4">Send a Direct Message</h3>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[var(--ok)] mx-auto" />
              <h4 className="font-bold text-base text-[var(--ink)]">Thank you, {name}!</h4>
              <p className="text-xs text-[var(--mut)] max-w-sm mx-auto">
                Your message has been assigned reference ticket <b>#TKT-{ticketId}</b>. A concierge specialist will reply to {email} shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                }}
                className="btn ghost text-xs py-2 px-4 mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inq-name" className="text-xs">Your Name</label>
                  <input
                    type="text"
                    id="inq-name"
                    placeholder="Poorni Gamage"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-xs py-2"
                  />
                </div>
                <div>
                  <label htmlFor="inq-email" className="text-xs">Email Address</label>
                  <input
                    type="email"
                    id="inq-email"
                    placeholder="poorni@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-xs py-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inq-subject" className="text-xs">Inquiry Topic</label>
                <select
                  id="inq-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="text-xs py-2"
                >
                  <option value="Order Inquiry">Order Inscription &amp; Delivery Status</option>
                  <option value="Artisan Partnership">Artisan Storefront Application</option>
                  <option value="Corporate Hampers">Custom Corporate Gift Hampers</option>
                  <option value="Quality Concern">Craft Quality or Dispute Report</option>
                </select>
              </div>

              <div>
                <label htmlFor="inq-msg" className="text-xs">Message</label>
                <textarea
                  id="inq-msg"
                  rows={4}
                  placeholder="Describe your inquiry or order reference..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <button
                type="submit"
                className="btn gold w-full text-xs font-bold py-2.5 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
