"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Checker from "@/components/Checker";
import Image from "next/image";

const PhisingCheck = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 via-white to-white relative sm:px-6 px-0">
      <Navbar />
      <Checker
        predict_api="predict_phishing"
        feedback_api="phishing_feedback"
        title="phishing"
        resultId="phishingresultID"
      ></Checker>
      <Image
        src="/CyberShield.png"
        width={10000}
        height={10000}
        alt="logo"
        className="hidden md:block w-[490px] h-[430px] absolute right-4 bottom-10"
      />
    </div>
  );
};

export default PhisingCheck;
