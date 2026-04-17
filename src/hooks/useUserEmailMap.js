"use client";

import { useEffect, useMemo, useState } from "react";
import { getUserEmailMapByIds } from "../services/userService";

export default function useUserEmailMap(userIds) {
  const [emailMap, setEmailMap] = useState({});
  const uniqueIds = useMemo(
    () => Array.from(new Set((Array.isArray(userIds) ? userIds : []).filter(Boolean))),
    [userIds]
  );

  useEffect(() => {
    if (uniqueIds.length === 0) {
      return undefined;
    }

    let cancelled = false;

    const resolveEmails = async () => {
      const nextMap = await getUserEmailMapByIds(uniqueIds);

      if (!cancelled) {
        setEmailMap(nextMap);
      }
    };

    resolveEmails();

    return () => {
      cancelled = true;
    };
  }, [uniqueIds]);

  return uniqueIds.length > 0 ? emailMap : {};
}
