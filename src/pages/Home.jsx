import React from "react";
import { useState } from "react";
import Tabs from "../components/Tabs";
import Dashboard from "../components/Dashboard";
import Comsoon from "../components/Comsoon";
import Indikator from "../components/Indikator";

const Home = () => {
  const [tabs, setTabs] = useState(0);

  return (
    <div className="pl-8 pr-8 pt-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-7xl p-4 ">
        <div className="header mb-8">
          <h1 className="text-2xl font-bold">Benji</h1>
        </div>
        <Tabs tabs={tabs} setTabs={setTabs} />
        <div>
          {tabs === 0 && (
            <div className="flex justify-center items-center">
              <div className="w-full max-w-6xl p-4 ">
                <Dashboard />
              </div>
            </div>
          )}
          {tabs === 1 && (
            <div className="flex justify-center items-center">
              <div className="w-full max-w-6xl p-4 ">
                <Indikator />
              </div>
            </div>
          )}
          {tabs === 2 && <Comsoon />}
          {tabs === 3 && <Comsoon />}
        </div>
      </div>
    </div>
  );
};

export default Home;
