/**
 * Image Search Page
 * Full page for searching products by image
 */

import React from "react";
import ImageSearch from "../../components/ImageSearch";

const ImageSearchPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <ImageSearch />
      </div>
    </div>
  );
};

export default ImageSearchPage;
