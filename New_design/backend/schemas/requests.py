from pydantic import BaseModel
from typing import List

class StackMatcherRequest(BaseModel):
    skills: List[str]
