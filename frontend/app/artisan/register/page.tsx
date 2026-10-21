"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastStore } from "@/lib/store/toastStore";
import { Hammer, UploadCloud } from "lucide-react";

export default function ArtisanRegisterPortal() {
  const router = useRouter();
  const { register } = useAuthStore();
  const { showToast } = useToastStore();

  const [studioName, setStudioName] = useState("");
  const [makerName, setMakerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("Kandy");
  const [category, setCategory] = useState("Woodwork & Carvings");
  const [experienceYears, setExperienceYears] = useState("10+ years");
  const [bio, setBio] = useState("");
  const [portfolioUploaded, setPortfolioUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studioName || !makerName || !email || !password) {
      showToast("Please fill in all essential workshop credentials");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Register with ARTISAN role
      register(`${makerName} (${studioName})`, email, "ARTISAN");
      setIsSubmitting(false);
      showToast("Artisan application submitted! Studio portal unlocked.");
      router.push("/artisan");
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent)]/10 px-3 py-1 rounded-full">
          <Hammer className="w-3.5 h-3.5" />
          <span>Artisan Studio Onboarding</span>
        </div>
        <h2>Open Your Craft Storefront</h2>
        <p className="sub text-sm max-w-lg mx-auto">
          Keep over 85% of each sale. Receive custom customer specifications, approve digital proofs, and craft with guaranteed fair payment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="panel p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="text-base pb-2 border-b border-[var(--line)]">
            1. Workshop &amp; Maker Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studio-name" className="text-xs">Workshop / Studio Name</label>
              <input
                type="text"
                id="studio-name"
                placeholder="e.g. Kandy Teak Guild"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                required
                className="text-xs py-2"
              />
            </div>
            <div>
              <label htmlFor="maker-name" className="text-xs">Master Craftsperson Name</label>
              <input
                type="text"
                id="maker-name"
                placeholder="e.g. Bandara Weerasinghe"
                value={makerName}
                onChange={(e) => setMakerName(e.target.value)}
                required
                className="text-xs py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="art-email" className="text-xs">Studio Contact Email</label>
              <input
                type="email"
                id="art-email"
                placeholder="studio@craftvilla.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-xs py-2"
              />
            </div>
            <div>
              <label htmlFor="art-pw" className="text-xs">Portal Password</label>
              <input
                type="password"
                id="art-pw"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-xs py-2"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Craft Discipline & Location */}
        <div className="space-y-4">
          <h3 className="text-base pb-2 border-b border-[var(--line)]">
            2. Craft Heritage &amp; Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="craft-loc" className="text-xs">Workshop Province</label>
              <select
                id="craft-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-xs py-2"
              >
                <option value="Kandy">Kandy (Central)</option>
                <option value="Weligama">Weligama (Southern)</option>
                <option value="Galle Fort">Galle Fort (Southern)</option>
                <option value="Kegalle">Kegalle (Sabaragamuwa)</option>
                <option value="Negombo">Negombo (Western)</option>
                <option value="Matale">Matale (Central)</option>
                <option value="Anuradhapura">Anuradhapura (North Central)</option>
              </select>
            </div>

            <div>
              <label htmlFor="craft-cat" className="text-xs">Primary Discipline</label>
              <select
                id="craft-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs py-2"
              >
                <option value="Woodwork & Carvings">Woodwork &amp; Joinery</option>
                <option value="Resin Floral Art">Resin Botanical Art</option>
                <option value="Wheel-Thrown Pottery">Wheel-Thrown Pottery</option>
                <option value="Wax-Resist Batik">Wax-Resist Dyed Batik</option>
                <option value="Handmade Leather">Hand-Stitched Leather</option>
                <option value="Brass & Metal">Chased Brass &amp; Metal</option>
              </select>
            </div>

            <div>
              <label htmlFor="craft-exp" className="text-xs">Studio Experience</label>
              <select
                id="craft-exp"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="text-xs py-2"
              >
                <option value="3-5 years">3–5 years</option>
                <option value="5-10 years">5–10 years</option>
                <option value="10+ years">10+ years (Master)</option>
                <option value="Generational (2+ gens)">Multi-generational</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="art-bio" className="text-xs">Workshop Story &amp; Technique Summary</label>
            <textarea
              id="art-bio"
              rows={3}
              placeholder="Describe your raw materials, wood seasoning process, natural dyes, or clay kilns..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        {/* Section 3: Workshop Samples Dropzone */}
        <div className="space-y-4">
          <h3 className="text-base pb-2 border-b border-[var(--line)]">
            3. Workshop Verification Portfolio
          </h3>

          <div
            onClick={() => setPortfolioUploaded(true)}
            className="border-2 border-dashed border-[var(--line)] p-6 rounded-xl text-center cursor-pointer hover:border-[var(--accent)] transition-colors"
          >
            <UploadCloud className="w-8 h-8 text-[var(--accent)] mx-auto mb-1.5" />
            <p className="text-xs font-bold text-[var(--ink)]">
              {portfolioUploaded
                ? "✓ 4 Workshop sample photos attached!"
                : "Upload 3-5 photographs of your workshop & finished sample pieces"}
            </p>
            <p className="text-[11px] text-[var(--mut)] mt-1">
              Supports JPG, PNG, or PDF. Super Admin reviews for verified artisan badge.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn gold w-full text-sm font-bold py-3 shadow-md"
        >
          {isSubmitting ? "Submitting Application..." : "Submit Application & Access Studio Portal"}
        </button>

        <p className="text-[11px] text-[var(--mut)] text-center">
          Already a verified artisan maker?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline font-semibold">
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
}
