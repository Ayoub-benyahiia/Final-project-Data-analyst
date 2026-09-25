from typing import List, Optional

from fastapi import Query
from pydantic import BaseModel, Field


class GlobalFilterSchema(BaseModel):
    cities: List[str] = Field(default_factory=list, max_length=50)
    contracts: List[str] = Field(default_factory=list, max_length=50)
    education: List[str] = Field(default_factory=list, max_length=50)
    experience: List[str] = Field(default_factory=list, max_length=50)
    technologies: List[str] = Field(default_factory=list, max_length=50)
    soft_skills: List[str] = Field(default_factory=list, max_length=50)

    def to_params(self) -> dict:
        return {
            "cities": self.cities or [],
            "contracts": self.contracts or [],
            "education": self.education or [],
            "experience": self.experience or [],
            "technologies": self.technologies or [],
            "soft_skills": self.soft_skills or [],
        }

def get_global_filters(
    cities: Optional[str] = Query(None, max_length=2000, description="Comma-separated cities"),
    contracts: Optional[str] = Query(None, max_length=2000, description="Comma-separated contracts"),
    education: Optional[str] = Query(None, max_length=2000, description="Comma-separated education levels"),
    experience: Optional[str] = Query(None, max_length=2000, description="Comma-separated experience levels"),
    technologies: Optional[str] = Query(None, max_length=2000, description="Comma-separated technologies"),
    hard_skills: Optional[str] = Query(None, max_length=2000, description="Comma-separated hard skills (alias for technologies)"),
    soft_skills: Optional[str] = Query(None, max_length=2000, description="Comma-separated soft skills"),
) -> GlobalFilterSchema:
    def parse_csv(val: Optional[str]) -> List[str]:
        if not val:
            return []
        seen = set()
        result = []
        for item in val.split(","):
            cleaned = item.strip()[:100]
            if cleaned and cleaned not in seen:
                seen.add(cleaned)
                result.append(cleaned)
                if len(result) >= 50:
                    break
        return result

    parsed_techs = parse_csv(technologies) or parse_csv(hard_skills)

    return GlobalFilterSchema(
        cities=parse_csv(cities),
        contracts=parse_csv(contracts),
        education=parse_csv(education),
        experience=parse_csv(experience),
        technologies=parsed_techs,
        soft_skills=parse_csv(soft_skills),
    )
