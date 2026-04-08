/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MdCheckCircle } from "react-icons/md";

interface AppState {
  showCard: boolean;
  setShowCard: (value: boolean) => void;
  Text: string;
}

const SuccessCard: React.FC<AppState> = ({ showCard, setShowCard, Text }) => {
  if (!showCard) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-4">
          <MdCheckCircle size={40} className="text-green-400" />
        </div>

        <h3 className="text-xl font-dayone text-gray-100 mb-2">
          Uploaded Successfully
        </h3>

        <p className="text-sm font-roboto text-gray-400 mb-6">
          {Text}
        </p>

        <button
          onClick={() => {
            window.location.replace("/admin");
            setShowCard(false);
          }}
          className="w-full py-3 text-base font-roboto font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SuccessCard;
