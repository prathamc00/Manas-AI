from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.core.database import get_db
from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_required_current_user,
    get_current_user
)
from app.database.models import User
from app.schemas.auth import UserSignUp, UserLogin, TokenResponse, UserProfile

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=TokenResponse)
async def signup(payload: UserSignUp, db: AsyncSession = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    
    # Check if email is already registered
    stmt = select(User).where(User.email == email_clean)
    res = await db.execute(stmt)
    existing_user = res.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(payload.password)
    user_name = payload.name.strip() if payload.name else email_clean.split("@")[0].capitalize()
    
    new_user = User(
        id=user_id,
        email=email_clean,
        hashed_password=hashed_pwd,
        name=user_name,
        preferences={"tone": "warm", "directness": "balanced"}
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Generate JWT token
    token = create_access_token({"sub": user_id, "email": email_clean})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    
    stmt = select(User).where(User.email == email_clean)
    res = await db.execute(stmt)
    user = res.scalars().first()
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = create_access_token({"sub": user.id, "email": user.email})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile.model_validate(user)
    )

@router.get("/me", response_model=UserProfile)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return UserProfile.model_validate(current_user)
