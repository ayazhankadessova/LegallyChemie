from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union
from enum import Enum

class ProductUrlInput(BaseModel):
    product_url: str

class SearchInput(BaseModel):
    query: str

class TimeOfDay(str, Enum):
    AM = "AM"
    PM = "PM"
