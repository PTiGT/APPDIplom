import { useEffect, useState } from "react";
import { meApi, type Activity, type Favorites, type MeStats } from "../api/me";
import type { LessonProgress } from "../api/types";
import { getToken } from "../auth/session";

export function useMeStats() {
  const [data, setData] = useState<MeStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    meApi
      .stats()
      .then((r) => {
        if (cancelled) return;
        if (r.error) setError(r.error);
        else setData(r.data);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error };
}

export function useMeActivity(take = 30) {
  const [data, setData] = useState<Activity[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    meApi
      .activity(take)
      .then((r) => {
        if (cancelled) return;
        if (r.error) setError(r.error);
        else setData(r.data);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      });
    return () => {
      cancelled = true;
    };
  }, [take]);

  return { data, error };
}

export function useMeFavorites() {
  const [data, setData] = useState<Favorites | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    if (!getToken()) return;
    const r = await meApi.favorites();
    if (r.error) setError(r.error);
    else setData(r.data);
  }

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      meApi
        .favorites()
        .then((r) => {
          if (cancelled) return;
          if (r.error) setError(r.error);
          else setData(r.data);
        })
        .catch((e: unknown) => {
          if (cancelled) return;
          setError(e instanceof Error ? e.message : "Unknown error");
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, refresh };
}

export function useLessonProgress(topicId?: number) {
  const [data, setData] = useState<LessonProgress[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    if (!getToken()) return;
    const r = await meApi.progress(topicId);
    if (r.error) setError(r.error);
    else setData(r.data);
  }

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      meApi
        .progress(topicId)
        .then((r) => {
          if (cancelled) return;
          if (r.error) setError(r.error);
          else setData(r.data);
        })
        .catch((e: unknown) => {
          if (cancelled) return;
          setError(e instanceof Error ? e.message : "Unknown error");
        });
    });
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  return { data, error, refresh };
}

