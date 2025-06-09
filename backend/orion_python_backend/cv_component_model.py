from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union, Dict, Any
from datetime import date

class CVComponent(BaseModel):
    component_name: str = Field(..., alias="Component Name")
    component_type: str = Field(..., alias="Component Type")
    content_primary: str = Field(..., alias="Content (Primary)")
    keywords: Optional[List[str]] = Field(default_factory=list, alias="Keywords")
    target_role_tags: Optional[List[str]] = Field(default_factory=list, alias="Target Role Tags")
    associated_company_institution: Optional[str] = Field(default=None, alias="Associated Company/Institution")
    start_date: Optional[Union[date, str]] = Field(default=None, alias="Start Date")
    end_date: Optional[Union[date, str]] = Field(default=None, alias="End Date")
    quantifiable_result_metric: Optional[str] = Field(default=None, alias="Quantifiable Result/Metric")
    relevance_score_manual: Optional[int] = Field(default=None, alias="Relevance Score (Manual)")
    notes_internal_comments: Optional[str] = Field(default=None, alias="Notes/Internal Comments")
    unique_id: Optional[str] = Field(default=None, alias="UniqueID")

    class Config:
        populate_by_name = True

    @validator('start_date', 'end_date', pre=True, always=True)
    def format_date(cls, v):
        if isinstance(v, date):
            return v.isoformat()
        return v
