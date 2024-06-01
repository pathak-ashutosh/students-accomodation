import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../components";
import { SearchProperties } from "../components";
import { supabase } from "../utils/supabase";
import { whiteWoodenShelfBesideBed } from "../assets/images";

const ITEMS_PER_PAGE = 10;

const fetchProperties = async (page, searchQuery) => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .range(from, to);

  if (searchQuery) {
    query = query.or(
      `street_addr.ilike.%${searchQuery}%,desc.ilike.%${searchQuery}%,rent.ilike.%${searchQuery}`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data, count };
};

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef();

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError(null); // Reset error state when loading new data

      try {
        const { data, count } = await fetchProperties(currentPage, searchQuery);
        setProperties((prevProperties) => {
          // If it's a new search, replace the properties, otherwise append
          return currentPage === 1 ? data : [...prevProperties, ...data];
        });
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to the first page on new search
    setProperties([]); // Clear previous properties
    setError(null); // Reset error state on new search
  };

  const lastPropertyElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, currentPage, totalPages]);

  return (
    <div className="relative lg:px-24 pt-14 max-lg:px-12">
      <div className="flex py-14 justify-between items-center sm:flex-row flex-col">
        <h1 className="font-inter text-3xl font-extrabold">
          Search Properties
        </h1>
        <div className="max-sm:mt-4">
          <SearchProperties onSearch={handleSearch} />
        </div>
      </div>
      {error && (
        <p className="text-red-500 flex justify-center items-start min-h-screen">
          Error loading properties: {error.message}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {properties.map((property, index) => {
          if (properties.length === index + 1) {
            return (
              <div className="my-8 p-4 rounded-3xl" ref={lastPropertyElementRef} key={property.id}>
                <Link to={`/properties/${property.id}`} className="text-lg">
                <img
                  src={whiteWoodenShelfBesideBed}
                  alt={`${property.street_addr}`}
                  className="rounded-2xl h-96 w-full object-cover"
                />
                  <h2 className="font-semibold border-b py-2">
                    {property.street_addr}
                  </h2>
                <p className="pt-2 tracking-tight border-b pb-2">{property.desc}</p>
                <p className="pt-2 ">Price: ${property.rent}</p>
                </Link>
              </div>
            );
          } else {
            return (
              <div className="my-8 p-4 rounded-3xl" key={property.id}>
                <Link to={`/properties/${property.id}`} className="text-lg">
                  <img
                    src={whiteWoodenShelfBesideBed}
                    alt={`${property.street_addr}`}
                    className="rounded-2xl h-96 w-full object-cover"
                  />
                  <h2 className="font-semibold border-b py-2">
                    {property.street_addr}
                  </h2>
                <p className="pt-2 tracking-tight border-b pb-2">{property.desc}</p>
                <p className="pt-2 ">Price: ${property.rent}</p>
                </Link>
              </div>
            );
          }
        })}
      </div>
      {loading && (
        <div className="flex justify-center items-start min-h-screen">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Properties;
