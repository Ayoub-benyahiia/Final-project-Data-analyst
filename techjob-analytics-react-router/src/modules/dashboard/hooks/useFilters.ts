import { useSearchParams } from "react-router-dom";

export function useFilters() {
  const [searchParams] = useSearchParams();

  const getSelected = (key: string): string[] => {
    const raw = searchParams.get(key);
    return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  };

  const tech = getSelected("technology");
  const hard = getSelected("hard_skills");

  return {
    city: getSelected("city"),
    contract: getSelected("contract"),
    education: getSelected("education"),
    expBucket: getSelected("expBucket"),
    technology: tech.length > 0 ? tech : hard,
    soft_skills: getSelected("soft_skills"),
    hasFilters: ["city", "contract", "education", "expBucket", "technology", "hard_skills", "soft_skills"].some(
      (k) => getSelected(k).length > 0
    ),
  };
}
