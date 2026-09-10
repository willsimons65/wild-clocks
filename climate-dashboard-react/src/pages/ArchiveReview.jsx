import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
} from "react-router-dom";

export default function ArchiveReview() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadRequest() {
      try {
        const response = await fetch(
          `/api/archive-review/${id}?token=${encodeURIComponent(token || "")}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load request"
          );
        }

        setRequest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id, token]);

  async function handleDecision(decision) {
    try {
      setError("");

      const response = await fetch(
        `/api/archive-review/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            decision,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to record decision"
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1d1d1d] text-white px-8 py-12">
        <p className="text-white/60">Loading request…</p>
      </main>
    );
  }

  if (error && !request) {
    return (
      <main className="min-h-screen bg-[#1d1d1d] text-white px-8 py-12">
        <h1 className="text-3xl font-light">
          Review request
        </h1>

        <p className="mt-6 text-white/70">
          {error}
        </p>
      </main>
    );
  }

  if (result) {
    return (
      <main className="min-h-screen bg-[#1d1d1d] text-white px-8 py-12">
        <h1 className="text-3xl font-light">
          Decision recorded
        </h1>

        <p className="mt-6 text-white/80">
          Your decision has been recorded successfully.
        </p>

        {result.status === "pending" && (
          <p className="mt-4 text-white/60">
            The request is still awaiting the other reviewer’s decision.
          </p>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1d1d1d] text-white px-8 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-light">
          Review data request
        </h1>

        <div className="mt-10 space-y-6">
          <div>
            <p className="text-sm text-white/50">
              Site
            </p>
            <p className="mt-1">
              {request.site}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50">
              Name
            </p>
            <p className="mt-1">
              {request.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50">
              Organisation
            </p>
            <p className="mt-1">
              {request.organisation || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50">
              Email
            </p>
            <p className="mt-1">
              {request.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50">
              How will they use the data?
            </p>
            <p className="mt-1 whitespace-pre-wrap">
              {request.purpose}
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-8 text-red-500">
            {error}
          </p>
        )}

        <div className="mt-10 flex gap-4">
          <button
            type="button"
            onClick={() =>
              handleDecision("approved")
            }
            className="rounded-full border border-white px-7 py-2 text-[#36e0b4]"
          >
            Approve
          </button>

          <button
            type="button"
            onClick={() =>
              handleDecision("declined")
            }
            className="rounded-full border border-white/40 px-7 py-2 text-white/70"
          >
            Decline
          </button>
        </div>
      </div>
    </main>
  );
}