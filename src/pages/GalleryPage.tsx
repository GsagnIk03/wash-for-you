import React from "react";
import PageHeader from "../components/PageHeader";
import Gallery from "../components/Gallery";

const GalleryPage: React.FC = () => (
  <>
    <PageHeader
      title="Our Work"
      subtitle="Real jobs, real results — bikes and cars cleaned at our customers' doorsteps across South Kolkata."
    />
    <Gallery />
  </>
);

export default GalleryPage;
