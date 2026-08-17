from fastapi import Query
from pydantic import BaseModel
from typing import List, Optional

class GlobalFilterSchema(BaseModel):
    cities: List[str] = []
    contracts: List[str] = []
    education: List[str] = []
    experience: List[str] = []
    technologies: List[str] = []
    soft_skills: List[str] = []

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
    cities: Optional[str] = Query(None, description="Comma-separated cities"),
    contracts: Optional[str] = Query(None, description="Comma-separated contracts"),
    education: Optional[str] = Query(None, description="Comma-separated education levels"),
    experience: Optional[str] = Query(None, description="Comma-separated experience levels"),
    technologies: Optional[str] = Query(None, description="Comma-separated technologies"),
    hard_skills: Optional[str] = Query(None, description="Comma-separated hard skills (alias for technologies)"),
    soft_skills: Optional[str] = Query(None, description="Comma-separated soft skills"),
) -> GlobalFilterSchema:
    def parse_csv(val: Optional[str]) -> List[str]:
        if not val:
            return []
        return [item.strip() for item in val.split(",") if item.strip()]

    parsed_techs = parse_csv(technologies) or parse_csv(hard_skills)

    return GlobalFilterSchema(
        cities=parse_csv(cities),
        contracts=parse_csv(contracts),
        education=parse_csv(education),
        experience=parse_csv(experience),
        technologies=parsed_techs,
        soft_skills=parse_csv(soft_skills),
    )
