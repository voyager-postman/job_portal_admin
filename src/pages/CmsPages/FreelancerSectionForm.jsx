import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PlaceIcon from "@mui/icons-material/Place";
import { API_BASE_URL, API_IMAGE_URL } from "../../Url/Url";
import { useDebounce } from "../../hooks/useDebounce";
import "./freelancerSection.css";

const MAX_SELECTED = 50;
const MIN_DISPLAY_LIMIT = 1;
const MAX_DISPLAY_LIMIT = 24;
const DEFAULT_DISPLAY_LIMIT = 6;
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const getFreelancerId = (item) =>
  String(item?._id || item?.id || item?.userId || item?.user_id || "");

const getFreelancerName = (item) => {
  if (!item) return "Unknown";
  if (item.name) return item.name;
  const first = item.first_name || item.firstName || "";
  const last = item.last_name || item.lastName || "";
  const full = `${first} ${last}`.trim();
  return full || item.email || "Unknown";
};

const getFreelancerImage = (item) => {
  const raw =
    item?.userImage ||
    item?.image ||
    item?.profileImage ||
    item?.avatar ||
    "";
  if (!raw || raw === "undefined" || raw === "null") return "";

  const path = String(raw).trim();
  if (!path) return "";

  if (path.includes("uploads/https")) {
    return path.substring(path.indexOf("https"));
  }

  if (/^https?:\/\//i.test(path)) return path;

  if (path.startsWith("/job_portal/uploads/")) {
    return `https://sisccltd.com${path}`;
  }

  return `${API_IMAGE_URL}${path}`;
};

const getSalaryLabel = (item) => {
  const salary = item?.salary;
  if (!salary) return "";
  if (typeof salary === "string" || typeof salary === "number") {
    return String(salary);
  }
  const amount = salary.amount ?? salary.value;
  const currency = salary.currency || "";
  if (amount === null || amount === undefined || amount === "") return "";
  return currency ? `${amount} ${currency}` : String(amount);
};

const normalizeFreelancer = (item) => {
  const id = getFreelancerId(item);
  if (!id) return null;
  return {
    id,
    name: getFreelancerName(item),
    jobTitle: item?.jobTitle || item?.job_title || item?.headline || "",
    location: item?.location || "",
    image: getFreelancerImage(item),
    salaryLabel: getSalaryLabel(item),
  };
};

const normalizeList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeFreelancer).filter(Boolean);
};

const extractSelectedList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload.selectedFreelancers)) {
    return payload.selectedFreelancers;
  }
  if (Array.isArray(payload.freelancers)) return payload.freelancers;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.config?.selectedFreelancers)) {
    return payload.config.selectedFreelancers;
  }
  if (Array.isArray(payload.section?.selectedFreelancers)) {
    return payload.section.selectedFreelancers;
  }
  return [];
};

const clampDisplayLimit = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return DEFAULT_DISPLAY_LIMIT;
  return Math.min(
    MAX_DISPLAY_LIMIT,
    Math.max(MIN_DISPLAY_LIMIT, Math.round(num))
  );
};

const FreelancerPhoto = ({ src, name }) => {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_AVATAR);

  useEffect(() => {
    setImgSrc(src || DEFAULT_AVATAR);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={name || "Freelancer"}
      crossOrigin={imgSrc === DEFAULT_AVATAR ? undefined : "anonymous"}
      onError={() => {
        if (imgSrc !== DEFAULT_AVATAR) {
          setImgSrc(DEFAULT_AVATAR);
        }
      }}
    />
  );
};

const FreelancerCard = ({
  item,
  actions,
  rank,
  showPublicBadge,
  displayLimit,
  index,
}) => (
  <div className="freelancer-card">
    {rank != null ? (
      <span className="freelancer-card__rank">{rank}</span>
    ) : null}
    <div className="freelancer-card__media">
      <FreelancerPhoto src={item.image} name={item.name} />
    </div>
    <div className="freelancer-card__body">
      <h6 className="freelancer-card__name">{item.name}</h6>
      {item.jobTitle ? (
        <p className="freelancer-card__title">{item.jobTitle}</p>
      ) : null}
      <div className="freelancer-card__meta">
        {item.salaryLabel ? (
          <span className="freelancer-card__meta-item">
            <span className="freelancer-card__icon">
              <AttachMoneyIcon />
            </span>
            {item.salaryLabel}
          </span>
        ) : null}
        {item.salaryLabel && item.location ? (
          <span className="freelancer-card__divider">/</span>
        ) : null}
        {item.location ? (
          <span className="freelancer-card__meta-item">
            <span className="freelancer-card__icon">
              <PlaceIcon />
            </span>
            {item.location}
          </span>
        ) : null}
      </div>
      {showPublicBadge ? (
        index < clampDisplayLimit(displayLimit) ? (
          <span className="freelancer-card__badge freelancer-card__badge--public">
            Shown publicly
          </span>
        ) : (
          <span className="freelancer-card__badge freelancer-card__badge--hidden">
            Hidden (over limit)
          </span>
        )
      ) : null}
    </div>
    {actions ? <div className="freelancer-card__actions">{actions}</div> : null}
  </div>
);

const FreelancerSectionForm = () => {
  const [mainTitle, setMainTitle] = useState("");
  const [shortParagraph, setShortParagraph] = useState("");
  const [displayLimit, setDisplayLimit] = useState(DEFAULT_DISPLAY_LIMIT);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search.trim(), 400);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const [homeRes, configRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}getHomePage`),
        axios.get(`${API_BASE_URL}getFreelancerSectionConfig`),
      ]);

      if (homeRes.status === "fulfilled") {
        const seventh = homeRes.value.data?.data?.seventhSection || {};
        setMainTitle(seventh.mainTitle || "");
        setShortParagraph(
          seventh.paragraph || seventh.shortParagraph || ""
        );

        const homeConfig = seventh.freelancersConfig || {};
        if (homeConfig.displayLimit != null) {
          setDisplayLimit(clampDisplayLimit(homeConfig.displayLimit));
        }
      }

      if (configRes.status === "fulfilled") {
        const body = configRes.value.data || {};
        const nested =
          body.data && typeof body.data === "object" && !Array.isArray(body.data)
            ? body.data
            : null;
        const section = body.section || nested?.section || nested || {};
        const config =
          body.config || nested?.config || nested?.freelancersConfig || {};
        const selectedRaw = Array.isArray(body.selectedFreelancers)
          ? body.selectedFreelancers
          : Array.isArray(nested?.selectedFreelancers)
            ? nested.selectedFreelancers
            : extractSelectedList(nested || body);

        if (homeRes.status !== "fulfilled") {
          setMainTitle(section.mainTitle || "");
          setShortParagraph(
            section.paragraph || section.shortParagraph || ""
          );
        }

        setDisplayLimit(
          clampDisplayLimit(config.displayLimit ?? DEFAULT_DISPLAY_LIMIT)
        );
        setSelected(normalizeList(selectedRaw));
      } else if (homeRes.status !== "fulfilled") {
        throw configRes.reason;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load freelancer section"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    let cancelled = false;

    const runSearch = async () => {
      setSearching(true);
      try {
        const res = await axios.get(`${API_BASE_URL}searchFreelancers`, {
          params: {
            name: debouncedSearch,
            page: 1,
            limit: 20,
          },
        });
        const body = res.data || {};
        const list = Array.isArray(body.freelancers)
          ? body.freelancers
          : Array.isArray(body.data)
            ? body.data
            : Array.isArray(body)
              ? body
              : [];
        if (!cancelled) {
          setSearchResults(normalizeList(list));
        }
      } catch (error) {
        if (!cancelled) {
          setSearchResults([]);
          toast.error(
            error.response?.data?.message || "Freelancer search failed"
          );
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    };

    runSearch();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const handleAdd = (freelancer) => {
    if (!freelancer?.id) return;
    if (selected.some((item) => item.id === freelancer.id)) {
      toast.info("Freelancer already selected");
      return;
    }
    if (selected.length >= MAX_SELECTED) {
      toast.error(`You can select up to ${MAX_SELECTED} freelancers`);
      return;
    }
    setSelected((prev) => [...prev, freelancer]);
  };

  const handleRemove = (id) => {
    setSelected((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const limit = clampDisplayLimit(displayLimit);
    setDisplayLimit(limit);

    const payload = {
      mainTitle: mainTitle.trim(),
      shortParagraph: shortParagraph.trim(),
      displayLimit: limit,
      selectedUserIds: selected.map((item) => item.id),
    };

    setSaving(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}updateFreelancerSection`,
        payload
      );
      toast.success(res.data?.message || "Freelancer section updated");
      await loadConfig();
    } catch (error) {
      const data = error.response?.data;
      const invalidIds = data?.invalidUserIds;
      if (Array.isArray(invalidIds) && invalidIds.length > 0) {
        toast.error(
          data?.message ||
            `Invalid freelancers rejected (${invalidIds.length}). Only users with Freelance employment type are accepted.`
        );
      } else {
        toast.error(data?.message || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const selectedIds = new Set(selected.map((item) => item.id));

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="form-group">
            <label>Main Title</label>
            <input
              type="text"
              className="form-control"
              name="mainTitle"
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              placeholder="Main Title"
              disabled={loading}
            />
          </div>
        </div>

        <div className="col-lg-12 col-md-12 mt-3">
          <div className="form-group">
            <label>Main Title Short Paragraph</label>
            <input
              type="text"
              className="form-control"
              name="shortParagraph"
              value={shortParagraph}
              onChange={(e) => setShortParagraph(e.target.value)}
              placeholder="Main Title Short Paragraph"
              disabled={loading}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 mt-3">
          <div className="form-group">
            <label>Display Limit</label>
            <input
              type="number"
              className="form-control"
              name="displayLimit"
              min={MIN_DISPLAY_LIMIT}
              max={MAX_DISPLAY_LIMIT}
              value={displayLimit}
              onChange={(e) => setDisplayLimit(e.target.value)}
              onBlur={() => setDisplayLimit(clampDisplayLimit(displayLimit))}
              disabled={loading}
            />
            <small className="text-muted">
              First {clampDisplayLimit(displayLimit)} freelancers in the list
              below are shown on the homepage (range {MIN_DISPLAY_LIMIT}–
              {MAX_DISPLAY_LIMIT}).
            </small>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 mt-3">
          <div className="form-group">
            <label>Search Freelancers</label>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              disabled={loading}
            />
            <small className="text-muted">
              Selected {selected.length}/{MAX_SELECTED}. Order is preserved on
              save.
            </small>
          </div>

          {debouncedSearch ? (
            <div className="mt-2">
              {searching ? (
                <p className="freelancer-card-empty mb-0">Searching…</p>
              ) : searchResults.length === 0 ? (
                <p className="freelancer-card-empty mb-0">No freelancers found</p>
              ) : (
                <div className="freelancer-card-grid">
                  {searchResults.map((item) => {
                    const alreadySelected = selectedIds.has(item.id);
                    return (
                      <FreelancerCard
                        key={item.id}
                        item={item}
                        actions={
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            disabled={
                              alreadySelected ||
                              selected.length >= MAX_SELECTED
                            }
                            onClick={() => handleAdd(item)}
                          >
                            {alreadySelected ? "Added" : "Add"}
                          </button>
                        }
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="col-lg-12 col-md-12 mt-3">
          <label>Selected Freelancers ({selected.length})</label>
          {selected.length === 0 ? (
            <p className="freelancer-card-empty mb-0">
              No freelancers selected. The public section will show an empty
              list.
            </p>
          ) : (
            <div className="freelancer-card-grid">
              {selected.map((item, index) => (
                <FreelancerCard
                  key={item.id}
                  item={item}
                  rank={index + 1}
                  showPublicBadge
                  displayLimit={displayLimit}
                  index={index}
                  actions={
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-12 mt-4">
          <div className="super-dashboard-content-btn-info">
            <button
              type="submit"
              className="super-dashboard-content-btn"
              disabled={loading || saving}
            >
              {saving ? "Saving…" : "Update Content"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FreelancerSectionForm;
