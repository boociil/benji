import { useState } from "react";

const Tabs = ({ tabs, setTabs }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");



  const onTabClick = (tab) => {
    const tabsList = ["Dashboard", "Indeks", "Manual", "Block"];
    setActiveTab(tabsList[tab]);
    setTabs(tab);
  }

  return (
    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
      <li className="me-2">
        <a
          href="#"
          aria-current="page"
          className={`inline-block p-4 rounded-t-lg ${
            activeTab === "Dashboard"
              ? "bg-gray-800 text-white active dark:bg-gray-800 dark:text-white"
              : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          }`}
          onClick={() => onTabClick(0)}
        >
          Dashboard
        </a>
      </li>
      <li className="me-2">
        <a
          href="#"
          aria-current="page"
          className={`inline-block p-4 rounded-t-lg ${
            activeTab === "Indeks"
              ? "bg-gray-800 text-white active dark:bg-gray-800 dark:text-white"
              : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          }`}
          onClick={() => onTabClick(1)}
        >
          Indeks
        </a>
      </li>
      <li className="me-2">
        <a
          href="#"
          className={`inline-block p-4 rounded-t-lg ${
            activeTab === "Manual"
              ? "bg-gray-800 text-white active dark:bg-gray-800 dark:text-white"
              : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          }`}
          onClick={() => onTabClick(2)}
        >
          Manual
        </a>
      </li>
      <li className="me-2">
        <a
          href="#"
          className={`inline-block p-4 rounded-t-lg ${
            activeTab === "Block"
              ? "bg-gray-800 text-white active dark:bg-gray-800 dark:text-white"
              : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          }`}
            onClick={() => onTabClick(3)}
        >
          Block
        </a>
      </li>
    </ul>
  );
};

export default Tabs;
