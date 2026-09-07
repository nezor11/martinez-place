import { useMessages } from "@/i18n";
import { availableIcons } from "@/stories/components/molecules/IconGallery";
import { cn } from "@/utils";
import { iconLabel } from "@/utils/iconLabels";
import type { FC, KeyboardEvent } from "react";
import { useEffect, useId, useRef } from "react";
import "./index.css";

export interface TechCount {
  /** Icon component name, as stored in Sanity (e.g. "ReactIcon"). */
  name: string;
  /** Projects that use the technology. */
  count: number;
  /** No project matching the current filter uses it. */
  dimmed?: boolean;
}

export interface PortfolioFilterProps {
  techs: TechCount[];
  activeIcon?: string;
  onIconClick: (name: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  searchOpen: boolean;
  onSearchToggle: (open: boolean) => void;
  matchCount: number;
  total: number;
}

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

/**
 * One row of technology buttons (with how many projects use each), a
 * magnifier that unfolds the text search, and the live result count. Every
 * control drives the same portfolio filter; the owner keeps the state.
 */
export const PortfolioFilter: FC<PortfolioFilterProps> = ({
  techs,
  activeIcon,
  onIconClick,
  query,
  onQueryChange,
  searchOpen,
  onSearchToggle,
  matchCount,
  total,
}) => {
  const t = useMessages();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const clear = () => {
    onQueryChange("");
    onSearchToggle(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      clear();
    }
  };

  return (
    <div className="portfolio-filter">
      <div className="portfolio-filter__row">
        <ul className="portfolio-filter__techs" aria-label={t.technologies}>
          {techs.map(({ name, count, dimmed }) => {
            const Icon = availableIcons[name];
            if (!Icon) return null;
            const active = activeIcon === name;
            return (
              <li key={name}>
                <button
                  type="button"
                  className={cn(
                    "portfolio-filter__tech",
                    active && "portfolio-filter__tech--active",
                    dimmed && !active && "portfolio-filter__tech--dimmed"
                  )}
                  aria-label={t.filterByTechCount(iconLabel(name), count)}
                  aria-pressed={active}
                  onClick={() => onIconClick(name)}
                >
                  <Icon width="1em" height="1em" />
                  <span className="portfolio-filter__count" aria-hidden="true">
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className={cn(
            "portfolio-filter__search-toggle",
            searchOpen && "portfolio-filter__search-toggle--open"
          )}
          aria-label={searchOpen ? t.hideSearch : t.searchProjects}
          aria-expanded={searchOpen}
          aria-controls={inputId}
          onClick={() => onSearchToggle(!searchOpen)}
        >
          <SearchIcon />
        </button>
      </div>
      <div
        className={cn("portfolio-filter__search", !searchOpen && "hidden")}
      >
        <label htmlFor={inputId} className="sr-only">
          {t.searchProjects}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.searchProjects}
          autoComplete="off"
          className="portfolio-filter__input"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label={t.clearSearch}
            className="portfolio-filter__clear"
          >
            ×
          </button>
        )}
      </div>
      <p className="portfolio-filter__status" aria-live="polite">
        {query ? t.resultsCount(matchCount, total) : ""}
      </p>
    </div>
  );
};
