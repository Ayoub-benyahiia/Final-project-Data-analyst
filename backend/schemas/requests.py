from typing import List

from pydantic import BaseModel, Field, field_validator


class StackMatcherRequest(BaseModel):
    skills: List[str] = Field(..., max_length=50, description="List of technology skills to analyze (max 50)")

    @field_validator("skills", mode="before")
    @classmethod
    def clean_skills(cls, v):
        if not isinstance(v, list):
            return v
        if len(v) > 50:
            raise ValueError("Number of skills cannot exceed 50")
        cleaned = []
        for s in v:
            if isinstance(s, str):
                trimmed = s.strip()[:100]
                if trimmed:
                    cleaned.append(trimmed)
            elif s is not None:
                cleaned.append(str(s).strip()[:100])
        return cleaned
