"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Upload, CheckCircle, ArrowLeft, Paperclip, X } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface FAQItem {
  id: string;
  question: string;
  answer: string[];
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: "Using Duolingo",
    items: [
      {
        id: "course_change",
        question: "Why did my course change?",
        answer: [
          "Duolingo continuously updates courses to make them better and more effective. As we make improvements, you might notice adjustments to existing content or the introduction of brand new material. When this happens, we may also reposition you within your learning path to better align with the fresh content and structure. Rest assured, this helps ensure that you receive the most up-to-date and impactful learning experience possible!",
        ],
      },
      {
        id: "streak_info",
        question: "What is a streak?",
        answer: [
          "Your streak (flame icon) represents the number of days in a row you've completed a lesson on Duolingo. Language learning is about building goals over time, and the streak is a proven way to motivate you to keep learning and practicing every day.",
          "Tip: Practice reminders can be a great help for remembering to do your lessons. In your notification settings you can turn on practice reminders and set the time that will work best for you.",
        ],
      },
      {
        id: "leaderboards",
        question: "What are leaderboards and leagues?",
        answer: [
          "Leaderboards are a fun way to compete with other Duolingo learners in a weekly contest. As you earn more XP (experience points) with each lesson, you'll rise in the ranks of your leaderboard. You'll face a new group of competitors each week. Check out the Leaderboards tab in the app to get the competition started!",
        ],
      },
      {
        id: "open_source",
        question: "Does Duolingo use any open source libraries?",
        answer: [
          "Yes. You can view our open source attributions and learn more from this page.",
        ],
      },
    ],
  },
  {
    title: "Account Management",
    items: [
      {
        id: "username_change",
        question: "How do I change my username or email address?",
        answer: [
          "If you want to edit your Duolingo username or email address, go to your settings and edit the username or email address. Your username appears on your weekly leaderboard. Remember to tap \"Save changes\" when you make any changes. If it is not changing, it means it is already taken by another Duolingo account. All usernames and email addresses are unique. Try changing the name again by adding unique letters or numbers to try to make it unique and save again. If the email address you are attempting to update to is already taken, you may have previously created another account with that email address.",
        ],
      },
      {
        id: "find_follow",
        question: "How do I find, follow, and block users on Duolingo?",
        answer: [
          "You can connect with other learners on Duolingo! When you follow someone, they'll show up on your friends list and you can encourage each other to stick with your language goals!",
        ],
      },
      {
        id: "remove_reset",
        question: "How do I remove or reset a course?",
        answer: [
          "Removing a course means erasing all of your learning progress and all of the XP you earned in that course, and this erasure cannot be undone. You can always add back a course later, but you'll have to start the course from the beginning or retake a placement test. Removing a course won't change your streak or leaderboard rank.",
        ],
      },
      {
        id: "trouble_access",
        question: "I'm having trouble accessing my account.",
        answer: [
          "If you forgot your password and need a new one, tap \"Forgot password\" on the login screen in the app, or visit http://duolingo.com/forgot_password and enter the email address associated with your Duolingo account. If you originally signed up with Google or Facebook, you'll need to supply the email associated with your Google or Facebook account instead. We'll send you a link to that email address, which will enable you to create a new password for your account. Be sure to check your spam folder if you do not see the reset email in your inbox! If you signed up with an inaccurate email address, you will not be able to change your password.",
        ],
      },
      {
        id: "delete_account",
        question: "How do I delete my account and access my data?",
        answer: [
          "Visit the \"Duolingo Data Vault\" to request a copy of all of your personal data stored by Duolingo. This can take up to 30 days.",
        ],
      },
      {
        id: "data_compromised",
        question: "What to do if your data was compromised",
        answer: [
          "You may have received an email alerting you about a data breach outside of Duolingo that included your personal information. This email is legitimate and we strongly urge you to take action in order to secure your data.",
        ],
      },
    ],
  },
  {
    title: "Subscription & Payments",
    items: [
      {
        id: "super_subscribe",
        question: "What is Super Duolingo and how do I subscribe?",
        answer: [
          "\"Super Duolingo\" is a premium addition to the Duolingo experience. With Super Duolingo, your benefits include:\n1. No ads: Learn without interruptions\n2. Unlimited Hearts: Enable Unlimited Hearts so mistakes won't slow you down\n3. Personalized Practice: Make a mistake? No problem, you'll receive a personalized lesson to practice your mistakes.\n4. Unlimited attempts at Legendary challenges: Master each of your units by reaching Legendary status!\n\nAlso, as a Super Duolingo subscriber, you support our mission to keep education free for millions around the world. We offer the same lesson content to all users because our mission is to develop the best language learning education in the world and make it universally available. When you start or end a subscription, your learning progress and streak will not be affected.",
        ],
      },
      {
        id: "family_plan",
        question: "Family Plan",
        answer: [
          "Language learning is better together — which is why we offer a Family Plan for Super Duolingo! Now you can share all the benefits of Super Duolingo with 5 of your family and friends, and encourage everyone to reach their goals together. When you join, start, or leave a Family Plan, your learning progress and streak will not be affected.",
        ],
      },
      {
        id: "cancel_super",
        question: "How do I cancel my Super Duolingo subscription?",
        answer: [
          "You can cancel your Super Duolingo subscription at any time. You will need to cancel your subscription based on how you originally started the subscription. Deleting the app and/or your account does not cancel your subscription.",
        ],
      },
      {
        id: "request_refund",
        question: "How do I request a refund?",
        answer: [
          "Generally, all charges for in-app purchases are nonrefundable, and there are no refunds or credits for partially used periods.",
        ],
      },
      {
        id: "promo_code",
        question: "How do I use a promo code?",
        answer: [
          "1. Visit duolingo.com/redeem in a web browser (on a phone, tablet, or computer)\n2. Enter your promo code and click \"Redeem\"\n3. If you're recognized as an eligible user, click \"Claim offer\"\n4. Log in if you have a Duolingo account, or if you don't, create an account\n5. Select a monthly, annual, or family Super Duolingo plan for after your free trial ends\n6. Submit your credit card information (you will only be charged if you continue with Super after your free trial ends)\n7. Start learning with Super Duolingo!",
        ],
      },
      {
        id: "duolingo_max",
        question: "What is Duolingo Max?",
        answer: [
          "Duolingo Max includes all the benefits of Super Duolingo, along with AI-powered features: Roleplay and Video Call with Lily.",
        ],
      },
    ],
  },
];

export default function HelpCenterPage() {
  const [view, setView] = useState<"faq" | "feedback" | "submitted">("faq");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Feedback form state
  const [email, setEmail] = useState("ajain10_be23@thapar.edu");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [ticketId, setTicketId] = useState("DUO-83921");

  const toggleItem = (id: string) => {
    sounds.playTap();
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playVictory();
    const randomTicket = "DUO-" + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomTicket);
    setView("submitted");
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setAttachedFiles((prev) => [...prev, ...names]);
      sounds.playTap();
    }
  };

  return (
    <div className="min-h-screen bg-white select-none pb-20">
      {/* Top Header matching Frame 007 */}
      <header className="border-b-2 border-gray-100 bg-white sticky top-0 z-30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/learn" className="flex items-center gap-2 group">
            <span className="text-3xl font-black text-[#58cc02] tracking-tighter group-hover:opacity-85 transition">
              duolingo
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider text-gray-500">
            <Link href="/learn" className="hover:text-black transition">
              Back to Learn
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Breadcrumb matching frames */}
        <div className="flex items-center gap-2 text-xs font-black tracking-wider text-[#1cb0f6] uppercase mb-8">
          <button
            onClick={() => {
              setView("faq");
              sounds.playTap();
            }}
            className="hover:underline"
          >
            HELP CENTER
          </button>
          <span>&gt;</span>
          <span className="text-[#1cb0f6]">
            {view === "faq" ? "HOME" : "FEEDBACK"}
          </span>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: FAQ ACCORDION LIST (Frames 001 - 035)            */}
        {/* ======================================================== */}
        {view === "faq" && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800 text-center mb-8">
              Frequently Asked Questions
            </h1>

            {FAQ_DATA.map((category) => (
              <div
                key={category.title}
                className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xs"
              >
                {/* Category Header */}
                <div className="p-5 sm:p-6 border-b-2 border-gray-100">
                  <h2 className="text-base sm:text-lg font-black text-[#1cb0f6]">
                    {category.title}
                  </h2>
                </div>

                {/* Question Accordion List */}
                <div className="divide-y-2 divide-gray-100">
                  {category.items.map((item) => {
                    const isExpanded = Boolean(expandedItems[item.id]);
                    return (
                      <div key={item.id} className="transition-colors">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition"
                        >
                          <span className="font-bold text-sm sm:text-base text-gray-800">
                            {item.question}
                          </span>
                          <span className="text-gray-400 shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                            )}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-6 pt-1 sm:px-6 text-xs sm:text-sm text-gray-600 font-bold leading-relaxed space-y-3 bg-gray-50/40 border-t border-gray-100 animate-fade-in">
                            {item.answer.map((para, pIdx) => (
                              <p key={pIdx} className="whitespace-pre-line">
                                {para}
                              </p>
                            ))}
                            <div className="pt-2">
                              <span className="text-[11px] font-black uppercase tracking-wider text-[#58cc02] cursor-pointer hover:underline inline-block">
                                READ MORE
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Bottom Call to Action matching Frame 004 */}
            <div className="text-center pt-8 pb-12 space-y-4">
              <p className="text-base font-black text-gray-800">
                Still unsure about something?
              </p>
              <button
                onClick={() => {
                  setView("feedback");
                  sounds.playTap();
                }}
                className="px-8 py-3.5 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-wider btn-3d-blue shadow-md"
              >
                SEND FEEDBACK
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: FEEDBACK FORM (Frames 036 - 040)                 */}
        {/* ======================================================== */}
        {view === "feedback" && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800 text-center mb-8">
              What can we help you with?
            </h1>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Describe Your Issue */}
                  <div className="md:col-span-1 space-y-2">
                    <h2 className="text-base font-black text-gray-800">
                      Describe your issue
                    </h2>
                    <p className="text-xs font-bold text-gray-400 leading-relaxed">
                      Please describe the issue you are experiencing in as much detail as possible. This will help us understand what&apos;s going on.
                    </p>
                  </div>

                  {/* Right Column: Input Fields */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Your Email Address */}
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        Your Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-2xl border-2 border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f9fafb]"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Brief summary of your question or issue"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 rounded-2xl border-2 border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f9fafb]"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Please include lesson name, question text, or unexpected behavior..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-2xl border-2 border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f9fafb]"
                      />
                    </div>

                    {/* Type of Issue */}
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        Type of issue <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="w-full p-3 rounded-2xl border-2 border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f9fafb]"
                      >
                        <option value="">PLEASE SELECT ONE...</option>
                        <option value="bug">Bug Report / Something broke</option>
                        <option value="audio">Audio / Sound Pronunciation Issue</option>
                        <option value="course">Hindi Course Content or Translation Error</option>
                        <option value="account">Account Access / Password Issue</option>
                        <option value="billing">Subscription & Payments / Super Duolingo</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>

                    {/* Attachments Dropzone matching Frame 038-040 */}
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        Attachments
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50/70 transition cursor-pointer relative">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileDrop}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Paperclip className="w-5 h-5 text-gray-400" />
                          <p className="text-xs font-black text-[#1cb0f6]">
                            Add file <span className="text-gray-400 font-bold">or drop files here</span>
                          </p>
                        </div>
                      </div>

                      {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {attachedFiles.map((f, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-lg flex items-center gap-1"
                            >
                              <span>{f}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-8 py-3.5 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-wider btn-3d-blue shadow-md"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: SUBMITTED CONFIRMATION STATE (Output of Submit)  */}
        {/* ======================================================== */}
        {view === "submitted" && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-6 max-w-lg mx-auto animate-scale-up">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
                Your request has been submitted!
              </h2>
              <p className="text-xs font-bold text-gray-400">
                Ticket Reference: <span className="font-mono text-gray-800 font-black">{ticketId}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
              Thanks for reaching out! A confirmation email has been sent to{" "}
              <span className="text-gray-900 font-black">{email}</span>. Our support team will review your report and get back to you shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  setView("faq");
                  setSubject("");
                  setDescription("");
                  setIssueType("");
                  setAttachedFiles([]);
                }}
                className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 font-black text-xs uppercase tracking-wider text-gray-700 transition"
              >
                Back to Help Center
              </button>
              <Link
                href="/learn"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider btn-3d-green text-center"
              >
                Return to Learn
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
