"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Home,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import type { SearchFilters } from "../../types";
import { PROPERTY_TYPES, QUARTIERS } from "../../data/constants";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const INITIAL_FILTERS: SearchFilters = {
  type: "Tous types",
  quartier: "Tous les quartiers",
  budgetMax: "",
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);

    window.setTimeout(() => {
      document.getElementById("listings")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const fieldStyle: React.CSSProperties = {
    position: "relative",
    minWidth: 0,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 4,
    color: "#7d8da3",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
  };

  const controlStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 42,
    padding: "9px 10px",
    border: "1px solid #dce5ef",
    borderRadius: 9,
    background: "#fff",
    color: "#0a2e5c",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    textAlign: "left",
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 5px)",
    right: 0,
    left: 0,
    zIndex: 100,
    maxHeight: 210,
    overflowY: "auto",
    border: "1px solid #dce5ef",
    borderRadius: 9,
    background: "#fff",
    boxShadow: "0 12px 30px rgba(10,46,92,0.16)",
  };

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        maxWidth: 760,
        margin: "-42px auto 0",
        padding: "0 14px",
      }}
    >
      <div
        style={{
          padding: 11,
          border: "1px solid #e6edf5",
          borderRadius: 14,
          background: "#fff",
          boxShadow: "0 8px 24px rgba(10,46,92,0.12)",
        }}
      >
        <div
          className="search-bar-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 7,
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>Type de bien</label>

            <button
              type="button"
              style={controlStyle}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "type" ? null : "type",
                )
              }
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                  gap: 5,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <Home size={14} color="#1a6dd4" />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {filters.type}
                </span>
              </span>

              <ChevronDown size={14} color="#8998aa" />
            </button>

            {activeDropdown === "type" && (
              <div style={dropdownStyle}>
                {PROPERTY_TYPES.map((propertyType) => (
                  <button
                    type="button"
                    key={propertyType}
                    onClick={() => {
                      updateFilter("type", propertyType);
                      setActiveDropdown(null);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      background:
                        filters.type === propertyType
                          ? "#f0f6ff"
                          : "#fff",
                      color:
                        filters.type === propertyType
                          ? "#1a6dd4"
                          : "#33445a",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight:
                        filters.type === propertyType ? 700 : 500,
                      textAlign: "left",
                    }}
                  >
                    {propertyType}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Quartier</label>

            <button
              type="button"
              style={controlStyle}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "quartier"
                    ? null
                    : "quartier",
                )
              }
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                  gap: 5,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <MapPin size={14} color="#1a6dd4" />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {filters.quartier}
                </span>
              </span>

              <ChevronDown size={14} color="#8998aa" />
            </button>

            {activeDropdown === "quartier" && (
              <div style={dropdownStyle}>
                {QUARTIERS.map((neighborhood) => (
                  <button
                    type="button"
                    key={neighborhood}
                    onClick={() => {
                      updateFilter("quartier", neighborhood);
                      setActiveDropdown(null);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      background:
                        filters.quartier === neighborhood
                          ? "#f0f6ff"
                          : "#fff",
                      color:
                        filters.quartier === neighborhood
                          ? "#1a6dd4"
                          : "#33445a",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight:
                        filters.quartier === neighborhood
                          ? 700
                          : 500,
                      textAlign: "left",
                    }}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Budget maximum</label>

            <div style={{ position: "relative" }}>
              <TrendingUp
                size={14}
                color="#1a6dd4"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 10,
                  transform: "translateY(-50%)",
                }}
              />

              <input
                type="text"
                inputMode="numeric"
                placeholder="Ex : 5 000 000"
                value={filters.budgetMax}
                onChange={(event) =>
                  updateFilter("budgetMax", event.target.value)
                }
                style={{
                  width: "100%",
                  minHeight: 42,
                  padding: "9px 8px 9px 30px",
                  border: "1px solid #dce5ef",
                  borderRadius: 9,
                  outline: "none",
                  background: "#fff",
                  color: "#0a2e5c",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: 42,
            gap: 7,
            marginTop: 8,
            padding: "10px 14px",
            border: "none",
            borderRadius: 9,
            background:
              "linear-gradient(135deg, #1a6dd4 0%, #287fe2 100%)",
            boxShadow: "0 6px 16px rgba(26,109,212,0.24)",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Search size={16} />
          Rechercher un bien
        </button>
      </div>
    </div>
  );
}