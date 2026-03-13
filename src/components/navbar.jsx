"use client";
import React, { useContext, useEffect } from "react";
import ServiceContextProvider from "../context/servicesProviderContext";
export default function Navbar() {
  const { service, setService } = useContext(ServiceContextProvider);
  const handleChange = (e) => {
    setService(e.target.value);
  };
  // useEffect(() => {
  //   console.log(service);
  // }, [service]);
  return (
    <nav className="navbar top-0 sticky">
      <div className="header">
        <div className="flex-col items-start justify-start">
          <a
            href="/"
            className="font-bold cursor-pointer"
            style={{ fontSize: "30px" }}
          >
            Fraud Detector
          </a>
          <p>Upload Excel with email and phone columns</p>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 items-center justify-center">
            <label
              className="font-semibold text-lg cursor-pointer"
              htmlFor="ipqs"
            >
              IPQS
            </label>
            <input
              type="radio"
              name="fraud_detector"
              id="ipqs"
              value="ipqs"
              checked={service === "ipqs"}
              onChange={handleChange}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
          <div className="flex gap-2 items-center justify-center">
            <label
              className="font-semibold text-lg cursor-pointer"
              htmlFor="ongrid"
            >
              Ongrid
            </label>
            <input
              type="radio"
              name="fraud_detector"
              id="ongrid"
              value="ongrid"
              checked={service === "ongrid"}
              onChange={handleChange}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
          <div className="flex gap-2 items-center justify-center">
            <label
              className="font-semibold text-lg cursor-pointer"
              htmlFor="both"
            >
              Both
            </label>
            <input
              type="radio"
              name="fraud_detector"
              id="both"
              value="both"
              checked={service === "both"}
              onChange={handleChange}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
