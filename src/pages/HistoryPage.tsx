import React from "react";
import PageHeader from "../components/PageHeader";
import History from "../components/History";

const HistoryPage: React.FC = () => (
  <>
    <PageHeader
      title="Our Story"
      subtitle="How Wash For U started, and what's kept us going since — one doorstep at a time."
    />
    <History />
  </>
);

export default HistoryPage;
