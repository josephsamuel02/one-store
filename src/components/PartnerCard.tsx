import React from "react";

const PartnerCard: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
      <div className="px-5 pt-5 pb-3">
        <span className="text-[10px] font-roboto font-bold uppercase tracking-widest text-Storepurple bg-purple-100 px-2.5 py-0.5 rounded-full">
          Official Partner
        </span>
      </div>

      <div className="flex flex-col items-center px-5 pb-5 gap-4">
        <div className="w-auto h-32 px-4 rounded-2xl bg-white border-2 border-purple-100 shadow-sm flex items-center justify-center overflow-hidden">
          <img
            src="/img/Flashmart.jpg"
            alt="Flashmart"
            className="w-auto h-full object-contain py-2"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              const parent = el.parentElement;
              if (parent && !parent.querySelector("svg")) {
                parent.innerHTML = `<svg class="w-10 h-10 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`;
              }
            }}
          />
        </div>

        <div className="text-center">
          {/* <h3 className="text-lg font-dayone text-gray-900 mb-1">Flashmart</h3> */}
          <p className="text-xs font-roboto text-gray-500 leading-relaxed">
            Your orders are fulfilled in partnership with{" "}
            <span className="font-semibold text-gray-700">Flashmart</span>, our trusted
            supply partner.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 border border-green-100 text-green-600">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <span className="text-xs font-roboto font-semibold">Verified Partner</span>
        </div>
      </div>

      <div className="border-t border-purple-100/60 bg-gradient-to-r from-Storepurple/5 via-purple-50 to-Storepurple/5 px-5 py-4 flex flex-col gap-2.5">
        {[
          {
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            label: "Quality Guaranteed",
          },
          { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Fast Fulfillment" },
          {
            icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
            label: "Trusted Supply",
          },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-gray-500">
            <svg
              className="w-4 h-4 text-Storepurple flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            <span className="text-xs font-roboto">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerCard;
