
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  X,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProfileManagement() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const getVerificationStatus = (profile) =>
    profile.verificationStatus || "pending";

  const getAccountStatus = (profile) =>
    profile.accountStatus || "active";

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/profiles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch profiles."
        );
      }

      const records = Array.isArray(data)
        ? data
        : data.profiles || data.data || [];

      setProfiles(records);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const searchText = [
        profile.fullName || "",
        profile.email || "",
        profile.mobile || "",
        profile.city || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesVerification =
        verificationFilter === "all" ||
        getVerificationStatus(profile) === verificationFilter;

      const matchesStatus =
        statusFilter === "all" ||
        getAccountStatus(profile) === statusFilter;

      return (
        matchesSearch &&
        matchesVerification &&
        matchesStatus
      );
    });
  }, [profiles, search, verificationFilter, statusFilter]);

  const statistics = {
    total: profiles.length,
    verified: profiles.filter(
      (profile) =>
        getVerificationStatus(profile) === "verified"
    ).length,
    pending: profiles.filter(
      (profile) =>
        getVerificationStatus(profile) === "pending"
    ).length,
    rejected: profiles.filter(
      (profile) =>
        getVerificationStatus(profile) === "rejected"
    ).length,
  };

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
  };

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  };

  const verificationStyle = (status) => {
    const styles = {
      verified: {
        color: "#15803d",
        background: "#dcfce7",
      },
      pending: {
        color: "#b45309",
        background: "#fef3c7",
      },
      rejected: {
        color: "#b91c1c",
        background: "#fee2e2",
      },
    };

    return styles[status] || {
      color: "#475569",
      background: "#f1f5f9",
    };
  };

  const accountStyle = (status) => {
    const styles = {
      active: {
        color: "#15803d",
        background: "#dcfce7",
      },
      suspended: {
        color: "#b45309",
        background: "#fef3c7",
      },
      blocked: {
        color: "#b91c1c",
        background: "#fee2e2",
      },
    };

    return styles[status] || {
      color: "#475569",
      background: "#f1f5f9",
    };
  };

  async function updateProfile(profile, action, value) {
    const actionText =
      action === "verification"
        ? `${value} verification for ${profile.fullName}`
        : `${value} account for ${profile.fullName}`;

    if (!window.confirm(`Are you sure you want to ${actionText}?`)) {
      return;
    }

    setUpdatingId(profile._id);

    try {
      const token = localStorage.getItem("token");

      const endpoint =
        action === "verification"
          ? `${API_URL}/api/admin/profiles/${profile._id}/verification`
          : `${API_URL}/api/admin/profiles/${profile._id}/status`;

      const body =
        action === "verification"
          ? { verificationStatus: value }
          : { accountStatus: value };

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update profile."
        );
      }

      const updatedProfile = {
        ...profile,
        ...(action === "verification"
          ? {
              verificationStatus:
                data.profile?.verificationStatus || value,
            }
          : {
              accountStatus:
                data.profile?.accountStatus || value,
            }),
      };

      setProfiles((previous) =>
        previous.map((item) =>
          item._id === profile._id
            ? { ...item, ...updatedProfile }
            : item
        )
      );

      setSelectedProfile((previous) =>
        previous?._id === profile._id
          ? { ...previous, ...updatedProfile }
          : previous
      );
    } catch (err) {
      window.alert(err.message);
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="admin-dashboard">
      <div
        className="admin-page-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="admin-eyebrow">
            MEMBER MANAGEMENT
          </span>

          <h1>Profile Management</h1>

          <p>
            Review member profiles and manage verification.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProfiles}
          disabled={loading}
          style={buttonStyle}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <Users size={23} color="#7c3aed" />
          <p>Total Profiles</p>
          <h2>{statistics.total}</h2>
        </div>

        <div style={cardStyle}>
          <CheckCircle size={23} color="#16a34a" />
          <p>Verified Profiles</p>
          <h2>{statistics.verified}</h2>
        </div>

        <div style={cardStyle}>
          <Clock size={23} color="#d97706" />
          <p>Pending Verification</p>
          <h2>{statistics.pending}</h2>
        </div>

        <div style={cardStyle}>
          <XCircle size={23} color="#dc2626" />
          <p>Rejected Profiles</p>
          <h2>{statistics.rejected}</h2>
        </div>
      </div>

      {/* Profile table */}
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              position: "relative",
              flex: "1 1 240px",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                color: "#64748b",
              }}
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, email, mobile..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px 12px 11px 40px",
                border: "1px solid #e5e7eb",
                borderRadius: 9,
              }}
            />
          </div>

          <select
            value={verificationFilter}
            onChange={(event) =>
              setVerificationFilter(event.target.value)
            }
            style={{
              padding: "10px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 9,
            }}
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={{
              padding: "10px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 9,
            }}
          >
            <option value="all">All Accounts</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {error && (
          <div
            style={{
              padding: 14,
              background: "#fef2f2",
              color: "#b91c1c",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: 40 }}>
            Loading profiles...
          </p>
        ) : filteredProfiles.length === 0 ? (
          <div style={{ textAlign: "center", padding: 45 }}>
            <Users size={38} color="#94a3b8" />
            <h3>No profiles found</h3>
            <p>Try another search or filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 850,
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Member",
                    "Contact",
                    "Location",
                    "Verification",
                    "Account",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: 13,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredProfiles.map((profile) => {
                  const verification =
                    getVerificationStatus(profile);

                  const account =
                    getAccountStatus(profile);

                  return (
                    <tr key={profile._id}>
                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <strong>
                          {profile.fullName || "Unnamed Member"}
                        </strong>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: 12,
                          }}
                        >
                          ID: {profile._id?.slice(-8)}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div>
                          <Mail size={13} /> {profile.email || "—"}
                        </div>
                        <div>
                          <Phone size={13} /> {profile.mobile || "—"}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <MapPin size={14} />
                        {profile.city || "—"}
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <span
                          style={{
                            ...verificationStyle(verification),
                            padding: "5px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {verification}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <span
                          style={{
                            ...accountStyle(account),
                            padding: "5px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {account}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                          }}
                        >
                          <button
                            type="button"
                            style={buttonStyle}
                            onClick={() =>
                              setSelectedProfile(profile)
                            }
                          >
                            <Eye size={15} />
                          </button>

                          {verification !== "verified" && (
                            <button
                              type="button"
                              style={buttonStyle}
                              disabled={updatingId === profile._id}
                              onClick={() =>
                                updateProfile(
                                  profile,
                                  "verification",
                                  "verified"
                                )
                              }
                            >
                              Approve
                            </button>
                          )}

                          {verification !== "rejected" && (
                            <button
                              type="button"
                              style={buttonStyle}
                              disabled={updatingId === profile._id}
                              onClick={() =>
                                updateProfile(
                                  profile,
                                  "verification",
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Profile detail modal */}
      {selectedProfile && (
        <div
          onClick={() => setSelectedProfile(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <section
            onClick={(event) => event.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 520,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Member Profile</h2>

              <button
                type="button"
                style={buttonStyle}
                onClick={() => setSelectedProfile(null)}
              >
                <X size={18} />
              </button>
            </div>

            <h3>
              <User size={18} /> {selectedProfile.fullName}
            </h3>

            <p>Email: {selectedProfile.email || "—"}</p>
            <p>Mobile: {selectedProfile.mobile || "—"}</p>
            <p>Location: {selectedProfile.city || "—"}</p>
            <p>Role: {selectedProfile.role || "user"}</p>
            <p>
              Email verified:{" "}
              {selectedProfile.isEmailVerified ? "Yes" : "No"}
            </p>
            <p>
              Profile verification:{" "}
              {getVerificationStatus(selectedProfile)}
            </p>
            <p>
              Account status:{" "}
              {getAccountStatus(selectedProfile)}
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 20,
              }}
            >
              {getAccountStatus(selectedProfile) !== "active" && (
                <button
                  type="button"
                  style={buttonStyle}
                  disabled={updatingId === selectedProfile._id}
                  onClick={() =>
                    updateProfile(
                      selectedProfile,
                      "account",
                      "active"
                    )
                  }
                >
                  Activate
                </button>
              )}

              {getAccountStatus(selectedProfile) !== "suspended" && (
                <button
                  type="button"
                  style={buttonStyle}
                  disabled={updatingId === selectedProfile._id}
                  onClick={() =>
                    updateProfile(
                      selectedProfile,
                      "account",
                      "suspended"
                    )
                  }
                >
                  Suspend
                </button>
              )}

              {getAccountStatus(selectedProfile) !== "blocked" && (
                <button
                  type="button"
                  style={buttonStyle}
                  disabled={updatingId === selectedProfile._id}
                  onClick={() =>
                    updateProfile(
                      selectedProfile,
                      "account",
                      "blocked"
                    )
                  }
                >
                  Block
                </button>
              )}

              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <ShieldCheck size={16} />
                Founder controls
              </span>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
