import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function getUserEmailMapByIds(userIds) {
  const uniqueIds = Array.from(new Set((Array.isArray(userIds) ? userIds : []).filter(Boolean)));

  if (uniqueIds.length === 0) {
    return {};
  }

  const resolvedEntries = await Promise.all(
    uniqueIds.map(async (userId) => {
      try {
        const userSnapshot = await getDoc(doc(db, "users", userId));
        const userData = userSnapshot.exists() ? userSnapshot.data() : null;
        const email =
          typeof userData?.email === "string" && userData.email.trim() ? userData.email.trim() : null;

        return [userId, email];
      } catch {
        return [userId, null];
      }
    })
  );

  return Object.fromEntries(resolvedEntries.filter(([, email]) => Boolean(email)));
}
