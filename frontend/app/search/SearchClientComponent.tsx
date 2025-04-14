'use client'; // Keep this here!

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Keep imports here

// ... (Keep ResearchIdea, Plan interfaces and sampleIdeas array) ...

export default function SearchClientComponent() { // Rename component
  const router = useRouter();
  const searchParams = useSearchParams(); // useSearchParams is used here
  const [searchQuery, setSearchQuery] = useState('');
  // ... rest of the state, useEffect, functions (handleSearch, handleSubmit, handleIdeaClick, generateResearchPlans) ...

  // ... rest of the JSX return statement ...
  return (
    <> {/* Use a fragment or a div if needed */}
       {/* All the existing JSX from the original search page goes here */}
       <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 text-center">探索研究方向</h2>
       {/* ... the form ... */}
       {/* ... the initial suggestions ... */}
       {/* ... loading indicator ... */}
       {/* ... error message ... */}
       {/* ... results display ... */}
    </>
  );
} 